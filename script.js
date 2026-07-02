const deviceData = {
  device_id: "GreenMood001",
  soil_moisture: 36,
  air_humidity: 58,
  temperature: 25.4,
  light: 820,
  water_level: 72,
  air_quality: 430,
  pump_status: "off",
  mode: "auto",
};

const metrics = [
  { key: "soil_moisture", label: "土壤湿度", unit: "%", icon: "土" },
  { key: "air_humidity", label: "空气湿度", unit: "%", icon: "气" },
  { key: "temperature", label: "环境温度", unit: "°C", icon: "温" },
  { key: "light", label: "光照强度", unit: "lx", icon: "光" },
  { key: "water_level", label: "水箱余量", unit: "%", icon: "水" },
  { key: "air_quality", label: "空气质量", unit: "ppm", icon: "氧" },
];

const trendData = {
  today: {
    title: "今日波动",
    labels: ["06", "09", "12", "15", "18", "21"],
    series: {
      soil: [42, 40, 38, 37, 36, 35],
      humidity: [54, 56, 58, 60, 59, 57],
      light: [180, 420, 860, 980, 620, 160],
    },
  },
  week: {
    title: "本周变化",
    labels: ["一", "二", "三", "四", "五", "六", "日"],
    series: {
      soil: [44, 43, 41, 39, 37, 36, 35],
      humidity: [56, 58, 60, 59, 57, 58, 61],
      light: [610, 760, 880, 820, 900, 720, 650],
    },
  },
  month: {
    title: "本月趋势",
    labels: ["1", "5", "10", "15", "20", "25", "30"],
    series: {
      soil: [52, 49, 46, 43, 40, 38, 36],
      humidity: [62, 60, 57, 59, 58, 56, 58],
      light: [680, 720, 760, 820, 870, 850, 810],
    },
  },
};

const calendarEvents = [
  { day: 2, title: "今日巡检", detail: "土壤湿度 36%，建议傍晚复查。" },
  { day: 5, title: "自动补水", detail: "系统计划在上午 09:00 检查水泵。" },
  { day: 12, title: "光照提醒", detail: "连续阴天，建议补充散射光。" },
  { day: 19, title: "清洁传感器", detail: "轻拭光照与空气质量探头。" },
  { day: 27, title: "营养液日", detail: "可少量添加绿植营养液。" },
];

const careGuideSuggestions = [
  "空气湿度表现不错，今晚只需继续观察，不建议额外喷雾。",
  "光照已经达到舒适区，可以把绿萝宝宝维持在当前窗边位置。",
  "若明早土壤湿度低于 35%，建议执行一次短时补水。",
];

const splashScreen = document.querySelector("#splash-screen");
const enterAppButton = document.querySelector("#enter-app");
const metricsGrid = document.querySelector("#metrics-grid");
const comfortScore = document.querySelector("#comfort-score");
const comfortLabel = document.querySelector("#comfort-label");
const ringFill = document.querySelector("#ring-fill");
const deviceId = document.querySelector("#device-id");
const modeTag = document.querySelector("#mode-tag");
const pumpStatus = document.querySelector("#pump-status");
const pumpSummary = document.querySelector("#pump-summary");
const autoToggle = document.querySelector("#auto-toggle");
const manualWaterButton = document.querySelector("#manual-water");
const toast = document.querySelector("#toast");
const tabButtons = document.querySelectorAll(".tab-button");
const screens = document.querySelectorAll(".screen");
const rangeButtons = document.querySelectorAll(".range-button");
const chartTitle = document.querySelector("#chart-title");
const trendChart = document.querySelector("#trend-chart");
const calendarGrid = document.querySelector("#calendar-grid");
const eventList = document.querySelector("#event-list");
const simulateAiButton = document.querySelector("#simulate-ai");
const guideOutput = document.querySelector("#guide-output");

let splashDismissed = false;
let currentMode = deviceData.mode;
let currentRange = "today";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function scoreMetric(value, min, max) {
  if (value < min) {
    return clamp((value / min) * 100, 0, 100);
  }

  if (value > max) {
    return clamp((max / value) * 100, 0, 100);
  }

  return 100;
}

function calculateComfortIndex() {
  const scores = [
    scoreMetric(deviceData.soil_moisture, 35, 60),
    scoreMetric(deviceData.air_humidity, 45, 70),
    scoreMetric(deviceData.temperature, 20, 28),
    scoreMetric(deviceData.light, 500, 1200),
    scoreMetric(deviceData.water_level, 45, 100),
    scoreMetric(800 - deviceData.air_quality, 250, 800),
  ];

  return Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
}

function renderMetrics() {
  metricsGrid.innerHTML = metrics
    .map(({ key, label, unit, icon }) => {
      const value = deviceData[key];
      return `
        <article class="metric-card">
          <div class="metric-icon">${icon}</div>
          <strong>${value}</strong>
          <span>${label} · ${unit}</span>
        </article>
      `;
    })
    .join("");
}

function renderComfort() {
  const score = calculateComfortIndex();
  comfortScore.textContent = String(score);
  ringFill.style.background = `conic-gradient(var(--accent) ${score * 3.6}deg, rgba(215, 233, 204, 0.8) 0deg)`;
  comfortLabel.textContent = score >= 85 ? "生长舒适" : score >= 70 ? "状态稳定" : "需要关注";
}

function updateModeUI() {
  const autoMode = currentMode === "auto";
  modeTag.textContent = autoMode ? "AUTO" : "MANUAL";
  pumpStatus.textContent = deviceData.pump_status;
  pumpSummary.textContent = autoMode
    ? "当前为自动监测模式"
    : "当前为手动监测模式";
  autoToggle.classList.toggle("active", autoMode);
  autoToggle.setAttribute("aria-pressed", String(autoMode));
}

function switchScreen(target) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === target);
  });

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === target);
  });
}

function normalizeSeries(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  return values.map((value) => {
    if (max === min) {
      return 50;
    }

    return 20 + ((value - min) / (max - min)) * 120;
  });
}

function createPolyline(points) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function renderChart(rangeKey) {
  const range = trendData[rangeKey];
  const width = 320;
  const height = 180;
  const left = 16;
  const right = width - 12;
  const top = 18;
  const bottom = height - 28;
  const usableWidth = right - left;
  const labels = range.labels;
  const xStep = usableWidth / (labels.length - 1 || 1);
  const soil = normalizeSeries(range.series.soil);
  const humidity = normalizeSeries(range.series.humidity);
  const light = normalizeSeries(range.series.light);

  chartTitle.textContent = range.title;

  const gridLines = [top, top + 40, top + 80, top + 120].map(
    (y) => `<line class="chart-grid-line" x1="${left}" y1="${y}" x2="${right}" y2="${y}"></line>`
  );

  const labelNodes = labels.map((label, index) => {
    const x = left + xStep * index;
    return `<text class="chart-label" x="${x}" y="${height - 10}" text-anchor="middle">${label}</text>`;
  });

  const lineMarkup = [
    { name: "soil", values: soil },
    { name: "humidity", values: humidity },
    { name: "light", values: light },
  ]
    .map(({ name, values }) => {
      const points = values.map((value, index) => {
        const x = left + xStep * index;
        const y = bottom - value;
        return [x, y];
      });

      const dots = points
        .map(
          ([x, y]) =>
            `<circle class="chart-dot ${name}" cx="${x}" cy="${y}" r="4"></circle>`
        )
        .join("");

      return `
        <polyline class="trend-line ${name}" points="${createPolyline(points)}"></polyline>
        ${dots}
      `;
    })
    .join("");

  trendChart.innerHTML = `${gridLines.join("")}${lineMarkup}${labelNodes.join("")}`;
}

function renderCalendar() {
  const headers = ["日", "一", "二", "三", "四", "五", "六"];
  const firstDayOffset = 3;
  const totalDays = 31;
  const cells = [];

  headers.forEach((item) => {
    cells.push(`<div class="calendar-day header">${item}</div>`);
  });

  for (let i = 0; i < firstDayOffset; i += 1) {
    cells.push('<div class="calendar-day"></div>');
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const eventful = calendarEvents.some((item) => item.day === day);
    const active = day === 2;
    cells.push(`
      <div class="calendar-day ${eventful ? "eventful" : ""} ${active ? "active" : ""}">
        ${day}
      </div>
    `);
  }

  calendarGrid.innerHTML = cells.join("");

  eventList.innerHTML = calendarEvents
    .map(
      ({ day, title, detail }) => `
        <div class="event-item">
          <strong>7/${day} · ${title}</strong>
          <span>${detail}</span>
        </div>
      `
    )
    .join("");
}

function hideSplash() {
  if (splashDismissed) {
    return;
  }

  splashDismissed = true;
  splashScreen.classList.add("hidden");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function bindEvents() {
  enterAppButton.addEventListener("click", hideSplash);
  window.setTimeout(hideSplash, 1800);

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchScreen(button.dataset.target);
    });
  });

  autoToggle.addEventListener("click", () => {
    currentMode = currentMode === "auto" ? "manual" : "auto";
    updateModeUI();
  });

  manualWaterButton.addEventListener("click", () => {
    manualWaterButton.classList.add("is-busy");
    manualWaterButton.textContent = "发送中...";
    deviceData.pump_status = "on";
    updateModeUI();

    window.setTimeout(() => {
      manualWaterButton.classList.remove("is-busy");
      manualWaterButton.textContent = "手动补水";
      deviceData.pump_status = "off";
      updateModeUI();
      showToast("已发送补水命令");
    }, 850);
  });

  rangeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentRange = button.dataset.range;
      rangeButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      renderChart(currentRange);
    });
  });

  simulateAiButton.addEventListener("click", () => {
    simulateAiButton.classList.add("is-loading");
    simulateAiButton.disabled = true;

    window.setTimeout(() => {
      const suggestion =
        careGuideSuggestions[Math.floor(Math.random() * careGuideSuggestions.length)];
      guideOutput.textContent = suggestion;
      simulateAiButton.classList.remove("is-loading");
      simulateAiButton.disabled = false;
    }, 700);
  });
}

function init() {
  deviceId.textContent = deviceData.device_id;
  renderMetrics();
  renderComfort();
  updateModeUI();
  renderChart(currentRange);
  renderCalendar();
  bindEvents();
}

init();
