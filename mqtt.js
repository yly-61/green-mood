(function () {
  const MQTT_CONFIG = {
    brokerHost: "zf0b90a3.ala.cn-hangzhou.emqxsl.cn",
    brokerPort: 8084,
    brokerPath: "/mqtt",
    username: "GreenMood001",
    password: "GreenMood001",
    sensorTopic: "GreenMood001/sensor",
    controlTopic: "GreenMood001/control",
  };

  const state = {
    client: null,
    status: "idle",
    lastError: null,
    lastMessageAt: null,
  };

  function emitStatusChange() {
    window.dispatchEvent(
      new CustomEvent("greenmood:mqtt-status", {
        detail: getStatus(),
      })
    );
  }

  function buildBrokerUrl() {
    return `wss://${MQTT_CONFIG.brokerHost}:${MQTT_CONFIG.brokerPort}${MQTT_CONFIG.brokerPath}`;
  }

  function getClientId() {
    const suffix = Math.random().toString(16).slice(2, 10);
    return `${MQTT_CONFIG.username}-web-${suffix}`;
  }

  function isObject(value) {
    return value != null && typeof value === "object" && !Array.isArray(value);
  }

  function normalizeTelemetryPayload(payload) {
    if (!isObject(payload)) {
      return null;
    }

    if (isObject(payload.telemetry)) {
      return payload.telemetry;
    }

    if (isObject(payload.data)) {
      return payload.data;
    }

    return payload;
  }

  function safeParseJson(rawMessage) {
    try {
      return JSON.parse(rawMessage);
    } catch (error) {
      console.warn("[GreenMoodMQTT] Received non-JSON payload:", rawMessage, error);
      return null;
    }
  }

  function subscribeSensorTopic() {
    if (!state.client) {
      return;
    }

    state.client.subscribe(MQTT_CONFIG.sensorTopic, { qos: 0 }, (error) => {
      if (error) {
        state.lastError = error;
        emitStatusChange();
        console.error("[GreenMoodMQTT] Failed to subscribe sensor topic:", error);
        return;
      }

      console.info("[GreenMoodMQTT] Subscribed:", MQTT_CONFIG.sensorTopic);
    });
  }

  function handleSensorMessage(topic, message) {
    if (topic !== MQTT_CONFIG.sensorTopic) {
      return;
    }

    const rawMessage = message.toString();
    const parsedPayload = safeParseJson(rawMessage);

    if (!parsedPayload) {
      return;
    }

    const telemetryPayload = normalizeTelemetryPayload(parsedPayload);

    if (!telemetryPayload) {
      return;
    }

    state.lastMessageAt = new Date().toISOString();

    if (window.GreenMoodBridge && typeof window.GreenMoodBridge.setTelemetry === "function") {
      window.GreenMoodBridge.setTelemetry(telemetryPayload);
    } else {
      console.warn("[GreenMoodMQTT] GreenMoodBridge.setTelemetry is unavailable.");
    }
  }

  function attachClientEvents(client) {
    client.on("connect", () => {
      state.status = "connected";
      state.lastError = null;
      emitStatusChange();
      console.info("[GreenMoodMQTT] Connected to EMQX Cloud.");
      subscribeSensorTopic();
    });

    client.on("reconnect", () => {
      state.status = "reconnecting";
      emitStatusChange();
      console.info("[GreenMoodMQTT] Reconnecting...");
    });

    client.on("close", () => {
      state.status = "closed";
      emitStatusChange();
      console.warn("[GreenMoodMQTT] Connection closed.");
    });

    client.on("offline", () => {
      state.status = "offline";
      emitStatusChange();
      console.warn("[GreenMoodMQTT] Client offline.");
    });

    client.on("error", (error) => {
      state.status = "error";
      state.lastError = error;
      emitStatusChange();
      console.error("[GreenMoodMQTT] Client error:", error);
    });

    client.on("message", handleSensorMessage);
  }

  function connect() {
    if (typeof window.mqtt === "undefined") {
      state.status = "error";
      emitStatusChange();
      console.error("[GreenMoodMQTT] mqtt.min.js is not loaded.");
      return null;
    }

    if (state.client && (state.client.connected || state.status === "reconnecting")) {
      return state.client;
    }

    state.status = "connecting";
    emitStatusChange();

    state.client = window.mqtt.connect(buildBrokerUrl(), {
      username: MQTT_CONFIG.username,
      password: MQTT_CONFIG.password,
      clientId: getClientId(),
      clean: true,
      keepalive: 60,
      connectTimeout: 10000,
      reconnectPeriod: 3000,
    });

    attachClientEvents(state.client);
    return state.client;
  }

  function disconnect() {
    if (!state.client) {
      return;
    }

    state.client.end();
    state.client = null;
    state.status = "idle";
    emitStatusChange();
  }

  function publishControl(payload, options = {}) {
    if (!state.client || !state.client.connected) {
      throw new Error("MQTT client is not connected.");
    }

    const message = typeof payload === "string" ? payload : JSON.stringify(payload);
    const publishOptions = {
      qos: 0,
      retain: false,
      ...options,
    };

    state.client.publish(MQTT_CONFIG.controlTopic, message, publishOptions);
  }

  function getStatus() {
    return {
      status: state.status,
      connected: Boolean(state.client && state.client.connected),
      sensorTopic: MQTT_CONFIG.sensorTopic,
      controlTopic: MQTT_CONFIG.controlTopic,
      lastMessageAt: state.lastMessageAt,
      lastError: state.lastError
        ? {
            message: state.lastError.message,
            name: state.lastError.name,
          }
        : null,
    };
  }

  window.GreenMoodMQTT = {
    connect,
    disconnect,
    publishControl,
    getStatus,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", connect, { once: true });
  } else {
    connect();
  }
})();
