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

camera_config = {
    "stream_url": "/api/camera/stream",
    "snapshot_url": "/api/camera/snapshot",
    "status": "reserved",
    "provider": "flask",
    "note": "摄像头服务接口已预留，等待后续接入真实视频流。"
}


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
你是 Green Mood（绿色心情）智能盆栽系统的 AI 助手。

你的身份：
- 你是一个自然、友好、专业的植物养护助手。
- 可以像 ChatGPT 一样正常聊天。
- 同时也能够结合植物实时传感器数据提供科学养护建议。

回答规则：

① 如果用户只是聊天，例如：
你好、hi、hello、在吗、谢谢、你是谁……
请自然回答，不要分析植物数据。

② 如果用户的问题与植物有关，例如：
要不要浇水？
今天光照够吗？
植物健康吗？
空气湿度正常吗？
为什么叶子发黄？
……
请结合下面提供的实时传感器数据分析回答。

③ 不要每次都重复全部传感器数据。

④ 只有当数据与问题相关时才引用数据。

⑤ 回答语气自然、亲切，像真正的智能助手，不要机械，不要像说明书。

植物信息：

植物名称：{plant_name}
植物种类：{plant_species}

实时传感器数据：

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
    except Exception:
        return jsonify({
            "reply": build_mock_reply(plant_name, plant_species, sensor_data, user_message),
            "source": "fallback"
        })


@app.route("/api/camera/config", methods=["GET", "POST"])
def camera_service_config():
    if request.method == "POST":
        data = request.get_json() or {}
        for key in ("stream_url", "snapshot_url", "status", "provider", "note"):
            if key in data and isinstance(data[key], str):
                camera_config[key] = data[key]

    return jsonify(camera_config)


@app.route("/api/camera/status", methods=["GET"])
def camera_service_status():
    return jsonify({
        "status": camera_config["status"],
        "provider": camera_config["provider"],
        "stream_url": camera_config["stream_url"],
        "snapshot_url": camera_config["snapshot_url"],
        "note": camera_config["note"]
    })


@app.route("/api/camera/stream", methods=["GET"])
def camera_stream_placeholder():
    return jsonify({
        "status": "reserved",
        "message": "摄像头视频流接口已预留，等待后续接入真实 Flask 视频流。"
    }), 501


@app.route("/api/camera/snapshot", methods=["GET"])
def camera_snapshot_placeholder():
    return jsonify({
        "status": "reserved",
        "message": "摄像头抓拍接口已预留，等待后续接入真实 Flask 图像抓拍。"
    }), 501

@app.route("/")
def home():
    return "Green Mood AI 后端运行成功"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)