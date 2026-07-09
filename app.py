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
                    "content": "你是 Green Mood 智能盆栽系统的植物养护助手，只回答植物养护、浇水、光照、温湿度、土壤湿度、空气质量、风扇通风相关问题。回答要简洁、清楚、适合课程项目展示。"
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
    app.run(host="0.0.0.0", port=5000, debug=True)