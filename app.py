from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)


def build_mock_reply(plant_name, plant_species, sensor_data, user_message):
    soil = sensor_data.get("soil_moisture", "--")
    humidity = sensor_data.get("air_humidity", "--")
    temperature = sensor_data.get("temperature", "--")
    light = sensor_data.get("light", "--")
    return (
        f"{plant_name}（{plant_species}）当前土壤湿度约 {soil}%，空气湿度约 {humidity}%，"
        f"温度约 {temperature}°C，光照约 {light} Lux。"
        f"针对你的问题“{user_message}”，建议先保持环境稳定，再结合晚间土壤干湿情况决定是否补水。"
    )

@app.route("/api/ai", methods=["POST"])
def ai_reply():
    data = request.get_json() or {}

    user_message = data.get("message", "")
    sensor_data = data.get("sensor_data", {})
    plant_name = data.get("plant_name", "绿萝宝宝")
    plant_species = data.get("plant_species", "绿萝")

    if not user_message:
        return jsonify({
            "reply": "请先输入你的植物养护问题。",
            "source": "validation"
        }), 400

    if not os.getenv("DEEPSEEK_API_KEY"):
        return jsonify({
            "reply": build_mock_reply(plant_name, plant_species, sensor_data, user_message),
            "source": "mock"
        })

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content": f"""
你是 Green Mood 智能盆栽系统的养护助手。

你的目标：
1. 用自然、亲切、简洁的中文和用户交流。
2. 当用户问到植物养护问题时，结合植物信息和实时传感器数据给出建议。
3. 当用户只是打招呼、闲聊、感谢或确认时，直接自然回应，不要生硬地分析数据。

回答要求：
- 优先回答用户当前最关心的问题，不要每次都重复所有传感器数据。
- 只有在数据和问题直接相关时，才引用具体数值。
- 如果数据看起来基本正常，就直接告诉用户“当前状态稳定”并给出下一步建议。
- 如果数据明显异常，再说明可能原因和建议操作。
- 不要编造不存在的硬件状态，不要过度下结论。
- 语气像一个真实的智能助手，避免说明书式表达。

当前植物信息：
- 植物名称：{plant_name}
- 植物种类：{plant_species}

当前实时传感器数据：
{sensor_data}
"""
                },
                {
                    "role": "user",
                    "content": f"植物名称：{plant_name}\n植物种类：{plant_species}\n当前传感器数据：{sensor_data}\n用户问题：{user_message}"
                }
            ]
        )

        return jsonify({
            "reply": response.choices[0].message.content,
            "source": "deepseek"
        })
    except Exception as e:
      print("DeepSeek 调用失败：", repr(e), flush=True)
      return jsonify({
        "reply": build_mock_reply(plant_name, plant_species, sensor_data, user_message),
        "source": "fallback",
        "error": str(e)
    })
@app.route("/")
def home():
    return "Green Mood AI 后端运行成功"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
