const deviceData = {
  device_id: "GreenMood001",
  soil_moisture: 36,
  air_humidity: 58,
  temperature: 25.4,
  light: 820,
  water_level: 72,
  air_quality: 430,
  pump_status: "off",
  fan_status: "off",
  mode: "auto",
};

const metricConfigs = [
  {
    key: "soil_moisture",
    label: "土壤湿度",
    unit: "%",
    icon: "soil",
    max: 100,
  },
  {
    key: "air_humidity",
    label: "空气湿度",
    unit: "%",
    icon: "humidity",
    max: 100,
  },
  {
    key: "temperature",
    label: "温度",
    unit: "°C",
    icon: "temperature",
    max: 40,
  },
  {
    key: "light",
    label: "光照强度",
    unit: "Lux",
    icon: "light",
    max: 1200,
  },
  {
    key: "water_level",
    label: "储备水量",
    unit: "%",
    icon: "water_level",
    max: 100,
  },
  {
    key: "air_quality",
    label: "空气质量",
    unit: "ppm",
    icon: "air_quality",
    max: 800,
  },
];

const trendData = {
  today: {
    title: "今日波动",
    labels: ["00:00", "06:00", "12:00", "18:00", "24:00"],
    markerIndex: 2,
    series: {
      soil: [42, 40, 36, 34, 35],
      humidity: [61, 54, 58, 50, 52],
      temp: [18, 15, 25, 28, 24],
      light: [10, 8, 26, 18, 24],
    },
  },
  week: {
    title: "本周变化",
    labels: ["一", "二", "三", "四", "五", "六", "日"],
    markerIndex: 4,
    series: {
      soil: [46, 44, 41, 39, 36, 35, 37],
      humidity: [59, 57, 61, 58, 56, 57, 60],
      temp: [23, 24, 25, 26, 25, 24, 25],
      light: [18, 22, 20, 27, 24, 21, 23],
    },
  },
  month: {
    title: "本月趋势",
    labels: ["1", "5", "10", "15", "20", "25", "30"],
    markerIndex: 3,
    series: {
      soil: [52, 48, 45, 41, 39, 36, 38],
      humidity: [63, 60, 58, 57, 56, 59, 58],
      temp: [21, 23, 24, 25, 26, 25, 24],
      light: [15, 19, 24, 28, 26, 22, 20],
    },
  },
};

const calendarStartDate = new Date(2026, 6, 2);

const calendarEvents = [
  {
    date: "2026-07-02",
    time: "09:30",
    type: "auto",
    title: "自动补水",
    detail: "自动补水 120ml",
  },
  {
    date: "2026-07-04",
    time: "18:20",
    type: "manual",
    title: "手动浇水",
    detail: "手动补水 80ml",
  },
  {
    date: "2026-07-06",
    time: "08:40",
    type: "auto",
    title: "自动补水",
    detail: "自动补水 100ml",
  },
  {
    date: "2026-07-09",
    time: "12:10",
    type: "auto",
    title: "自动补水",
    detail: "自动补水 120ml",
  },
  {
    date: "2026-07-12",
    time: "19:00",
    type: "manual",
    title: "手动浇水",
    detail: "手动补水 70ml",
  },
  {
    date: "2026-07-16",
    time: "10:15",
    type: "auto",
    title: "自动补水",
    detail: "自动补水 100ml",
  },
  {
    date: "2026-07-21",
    time: "20:05",
    type: "manual",
    title: "手动浇水",
    detail: "手动补水 90ml",
  },
  {
    date: "2026-07-24",
    time: "12:00",
    type: "auto",
    title: "自动补水",
    detail: "自动补水 120ml",
  },
];

const suggestionTemplates = [
  (name) =>
    `${name}状态平稳，建议继续保持 25°C 左右环境，并在傍晚检查土壤湿度是否低于 35%。`,
  (name) =>
    `${name}今天的空气湿度表现不错，晚间只需观察叶片状态，不建议额外喷雾。`,
  (name) =>
    `${name}的光照处于舒适区，明早若土壤湿度继续下降，可执行一次短时补水。`,
  (name, species) =>
    `${name}目前按照${species}的养护节奏来看，环境偏稳，今天更适合继续观察而不是频繁调整。`,
  (name, species) =>
    `${species}对通风较敏感，建议在午后短时开启风扇，帮助${name}周围空气流动，但避免长时间直吹叶片。`,
  (name, species) =>
    `${name}的储备水量还算充足，${species}今天优先关注叶片挺立状态和盆土表层干湿变化即可。`,
];

const splashScreen = document.querySelector("#splash-screen");
const enterAppButton = document.querySelector("#enter-app");
const plantNameNodes = document.querySelectorAll("[data-plant-name]");
const editNameToggle = document.querySelector("#edit-name-toggle");
const renamePanel = document.querySelector("#rename-panel");
const plantNameInput = document.querySelector("#plant-name-input");
const saveNameButton = document.querySelector("#save-name");
const profileDays = document.querySelector("#profile-days");
const metricsGrid = document.querySelector("#metrics-grid");
const comfortLabel = document.querySelector("#comfort-label");
const comfortFaces = document.querySelectorAll(".face-chip");
const comfortTipToggle = document.querySelector("#comfort-tip-toggle");
const comfortTipCard = document.querySelector("#comfort-tip-card");
const pumpStatus = document.querySelector("#pump-status");
const pumpSummary = document.querySelector("#pump-summary");
const autoToggle = document.querySelector("#auto-toggle");
const manualWaterButton = document.querySelector("#manual-water");
const manualWaterCopy = document.querySelector("#manual-water-copy");
const fanStatus = document.querySelector("#fan-status");
const manualFanButton = document.querySelector("#manual-fan");
const manualFanCopy = document.querySelector("#manual-fan-copy");
const mqttStatusBadge = document.querySelector("#mqtt-status-badge");
const refreshMetricsButton = document.querySelector("#refresh-metrics");
const metricsUpdatedAt = document.querySelector("#metrics-updated-at");
const toast = document.querySelector("#toast");
const tabButtons = document.querySelectorAll(".tab-button");
const screens = document.querySelectorAll(".screen");
const rangeButtons = document.querySelectorAll(".range-button");
const chartTitle = document.querySelector("#chart-title");
const trendChart = document.querySelector("#trend-chart");
const calendarGrid = document.querySelector("#calendar-grid");
const eventHighlight = document.querySelector("#event-highlight");
const eventList = document.querySelector("#event-list");
const eventListToggle = document.querySelector("#event-list-toggle");
const calendarPrevButton = document.querySelector("#calendar-prev");
const calendarNextButton = document.querySelector("#calendar-next");
const calendarMonthLabel = document.querySelector("#calendar-month-label");
const simulateAiButton = document.querySelector("#simulate-ai");
const guideOutput = document.querySelector("#guide-output");
const plantSpeciesInput = document.querySelector("#plant-species-input");
const savePlantSpeciesButton = document.querySelector("#save-plant-species");
const aiChatLog = document.querySelector("#ai-chat-log");
const aiChatIntro = document.querySelector("#ai-chat-intro");
const aiChatInput = document.querySelector("#ai-chat-input");
const sendAiButton = document.querySelector("#send-ai");
const aiBackendHint = document.querySelector("#ai-backend-hint");
const waterAlertOverlay = document.querySelector("#water-alert-overlay");
const waterAlertCopy = document.querySelector("#water-alert-copy");
const waterAlertConfirmButton = document.querySelector("#water-alert-confirm");

let splashDismissed = false;
let currentMode = deviceData.mode;
let currentRange = "today";
let currentPlantName = "绿萝宝宝";
let currentPlantSpecies = "绿萝";
let currentSuggestionIndex = 0;
let lastUpdatedAt = new Date();
let currentCalendarMonth = new Date(
  calendarStartDate.getFullYear(),
  calendarStartDate.getMonth(),
  1
);
let selectedCalendarDate = new Date(calendarStartDate);
let isEventListExpanded = false;
let hasAcknowledgedLowWaterAlert = false;
let isWaterAlertVisible = false;
let wasWaterLevelLow = deviceData.water_level < 20;

const mqttBridgeState = {
  fetchLatestTelemetry: null,
  fetchLatestTrendData: null,
  fetchLatestCalendarEvents: null,
};

const AI_API_URL = "https://greenmood001-279845-9-1452010214.sh.run.tcloudbase.com/api/ai";

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

function getComfortState(score) {
  if (score >= 85) {
    return { label: "舒适", activeIndex: 0 };
  }

  if (score >= 70) {
    return { label: "一般", activeIndex: 1 };
  }

  return { label: "较差", activeIndex: 2 };
}

function formatMetricValue(key, value) {
  if (key === "temperature") {
    return value.toFixed(1);
  }

  return String(value);
}

function formatBeijingTime(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Shanghai",
  }).format(date);
}

function getBeijingDateKey(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  }).formatToParts(date);
  const lookup = Object.fromEntries(parts.map((item) => [item.type, item.value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

function getCurrentRecordedDateKey() {
  return getBeijingDateKey(lastUpdatedAt);
}

function updateProfileDays() {
  const todayKey = getBeijingDateKey(new Date());
  const today = fromDateKey(todayKey);
  const start = new Date(
    calendarStartDate.getFullYear(),
    calendarStartDate.getMonth(),
    calendarStartDate.getDate()
  );
  const diffDays = Math.max(0, Math.round((today - start) / 86400000));
  profileDays.textContent = `陪伴你第 ${diffDays + 1} 天`;
}

function renderMetricIcon(icon) {
  const icons = {
    soil: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14"></path>
        <path d="M5 8h14"></path>
        <path d="M7 8l5 9 5-9"></path>
      </svg>
    `,
    humidity: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3C9.4 6.6 7 9.2 7 13a5 5 0 1 0 10 0c0-3.8-2.4-6.4-5-10Z"></path>
        <path d="M10 15.5c.5.9 1.3 1.5 2.6 1.8"></path>
      </svg>
    `,
    temperature: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 5a2 2 0 1 1 4 0v7.2a4.5 4.5 0 1 1-4 0Z"></path>
        <path d="M12 9v6"></path>
        <path d="M12 18.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"></path>
      </svg>
    `,
    light: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5"></path>
      </svg>
    `,
    water_level: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 13a5 5 0 0 0 10 0V7H7Z"></path>
        <path d="M17 13h2"></path>
        <path d="M7 13H5"></path>
      </svg>
    `,
    air_quality: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v16M4 12h16M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6"></path>
      </svg>
    `,
  };

  return icons[icon] ?? icon;
}

function updateUpdatedAtLabel() {
  metricsUpdatedAt.textContent = `更新于 ${formatBeijingTime(lastUpdatedAt)}（北京时间）`;
}

function updateComfortTipVisibility(isVisible) {
  comfortTipCard.classList.toggle("hidden", !isVisible);
  comfortTipToggle.setAttribute("aria-expanded", String(isVisible));
}

function updateMqttStatus(statusInfo = {}) {
  const isConnected = Boolean(statusInfo.connected);
  const normalizedStatus = isConnected ? "connected" : statusInfo.status;
  const nextState =
    normalizedStatus === "connected"
      ? { label: "连接成功", className: "is-connected" }
      : normalizedStatus === "connecting" || normalizedStatus === "reconnecting"
        ? { label: "连接中", className: "is-connecting" }
        : { label: "未连接", className: "is-disconnected" };

  mqttStatusBadge.textContent = nextState.label;
  mqttStatusBadge.classList.remove("is-connected", "is-connecting", "is-disconnected");
  mqttStatusBadge.classList.add(nextState.className);
}

function renderMetrics() {
  metricsGrid.innerHTML = metricConfigs
    .map(({ key, label, unit, icon, max }) => {
      const value = deviceData[key];
      const fill = clamp((value / max) * 100, 0, 100);

      return `
        <article class="metric-card">
          <div class="metric-meta">
            <div class="metric-icon">${renderMetricIcon(icon)}</div>
            <div class="metric-label">${label}</div>
          </div>
          <div class="metric-value">
            <strong>${formatMetricValue(key, value)}</strong><span class="metric-unit">${unit}</span>
          </div>
          <div class="metric-bar">
            <div class="metric-fill" style="width:${fill}%"></div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderComfort() {
  const score = calculateComfortIndex();
  const state = getComfortState(score);

  comfortLabel.textContent = state.label;
  comfortFaces.forEach((node, index) => {
    node.classList.toggle("active", index === state.activeIndex);
  });
}

function renderGuideText() {
  guideOutput.textContent = suggestionTemplates[currentSuggestionIndex](
    currentPlantName,
    currentPlantSpecies
  );
}

function updateAiBackendHint(text = "当前对话调用deepseek提供的大模型") {
  if (!aiBackendHint) {
    return;
  }

  aiBackendHint.textContent = text;
}

function renderAiChatIntro() {
  if (!aiChatIntro) {
    return;
  }

  aiChatIntro.textContent = `你好，我是 ${currentPlantName} 的养护助手。当前植物种类已设置为${currentPlantSpecies}，你可以直接问我浇水、光照、温湿度或通风建议。`;
}

function updatePlantNameUI() {
  plantNameNodes.forEach((node) => {
    node.textContent = currentPlantName;
  });

  plantNameInput.value = currentPlantName;
  renderGuideText();
  renderAiChatIntro();
}

function updatePlantSpeciesUI() {
  plantSpeciesInput.value = currentPlantSpecies;
  renderGuideText();
  renderAiChatIntro();
}

function updateModeUI() {
  const isAuto = currentMode === "auto";
  const isPumpBusy = deviceData.pump_status === "on";
  const isFanBusy = deviceData.fan_status === "on";

  pumpSummary.textContent = isAuto ? "自动" : "手动";
  pumpStatus.textContent = deviceData.pump_status;
  fanStatus.textContent = deviceData.fan_status;
  autoToggle.classList.toggle("active", isAuto);
  autoToggle.setAttribute("aria-pressed", String(isAuto));
  manualWaterButton.disabled = isAuto || isPumpBusy;
  manualWaterButton.classList.toggle("is-disabled", isAuto || isPumpBusy);
  manualFanButton.disabled = isAuto || isFanBusy;
  manualFanButton.classList.toggle("is-disabled", isAuto || isFanBusy);
  manualWaterCopy.textContent = isAuto
    ? "智能控制开启时，手动补水已锁定"
    : "可以手动控制水箱出水";
  manualFanCopy.textContent = isAuto
    ? "智能控制开启时，手动风扇已锁定"
    : "可以手动控制风扇运转";
}

function updateLowWaterAlertVisibility(isVisible) {
  if (!waterAlertOverlay) {
    return;
  }

  isWaterAlertVisible = isVisible;
  waterAlertOverlay.classList.toggle("hidden", !isVisible);
}

function evaluateLowWaterAlert() {
  const isWaterLevelLow = deviceData.water_level < 20;

  if (!isWaterLevelLow) {
    hasAcknowledgedLowWaterAlert = false;
    wasWaterLevelLow = false;
    updateLowWaterAlertVisibility(false);
    return;
  }

  if (!wasWaterLevelLow && !hasAcknowledgedLowWaterAlert) {
    waterAlertCopy.textContent = `当前储备水量已降到 ${deviceData.water_level}%，请尽快为水箱补水，避免影响自动控制。`;
    updateLowWaterAlertVisibility(true);
  }

  wasWaterLevelLow = true;
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

    return 24 + ((value - min) / (max - min)) * 110;
  });
}

function createPolyline(points) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function fromDateKey(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameDate(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isSameMonth(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

function formatCalendarMonth(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function formatFullDate(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatShortDate(date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function getMonthRecords(monthDate) {
  return calendarEvents.filter((item) => {
    const eventDate = fromDateKey(item.date);
    return isSameMonth(eventDate, monthDate);
  });
}

function getEarliestSelectableDate(monthDate) {
  if (isSameMonth(monthDate, calendarStartDate)) {
    return new Date(calendarStartDate);
  }

  return new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
}

function setCalendarMonth(date) {
  currentCalendarMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  if (!isSameMonth(selectedCalendarDate, currentCalendarMonth)) {
    selectedCalendarDate = getEarliestSelectableDate(currentCalendarMonth);
  }
}

function getRecordedCalendarEvents() {
  const currentRecordedDateKey = getCurrentRecordedDateKey();
  return calendarEvents.filter((item) => item.date <= currentRecordedDateKey);
}

function getCurrentMonthBoundary() {
  const [year, month] = getCurrentRecordedDateKey().split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function renderChart(rangeKey) {
  const range = trendData[rangeKey];
  const width = 320;
  const height = 180;
  const left = 18;
  const right = 304;
  const top = 24;
  const bottom = 146;
  const xStep = (right - left) / (range.labels.length - 1 || 1);
  const lineMap = [
    { name: "soil", values: normalizeSeries(range.series.soil) },
    { name: "humidity", values: normalizeSeries(range.series.humidity) },
    { name: "temp", values: normalizeSeries(range.series.temp) },
    { name: "light", values: normalizeSeries(range.series.light) },
  ];

  chartTitle.textContent = range.title;

  const gridLines = [top, top + 30, top + 60, top + 90, top + 120].map(
    (y) => `<line class="chart-grid-line" x1="${left}" y1="${y}" x2="${right}" y2="${y}"></line>`
  );

  const labels = range.labels
    .map((label, index) => {
      const x = left + xStep * index;
      return `<text class="chart-label" x="${x}" y="${height - 10}" text-anchor="middle">${label}</text>`;
    })
    .join("");

  const rightLabels = ["40°C", "30°C", "20°C", "10°C", "0°C"]
    .map((label, index) => {
      const y = top + 2 + index * 30;
      return `<text class="chart-side-label" x="${right + 8}" y="${y}" text-anchor="start">${label}</text>`;
    })
    .join("");

  const markerX = left + xStep * range.markerIndex;
  const marker = `
    <line class="chart-marker-line" x1="${markerX}" y1="${top}" x2="${markerX}" y2="${bottom}"></line>
    <rect class="chart-marker-pill" x="${markerX - 18}" y="${top - 16}" rx="10" ry="10" width="36" height="18"></rect>
    <text class="chart-marker-label" x="${markerX}" y="${top - 4}" text-anchor="middle">12:00</text>
  `;

  const lines = lineMap
    .map(({ name, values }) => {
      const points = values.map((value, index) => {
        const x = left + xStep * index;
        const y = bottom - value;
        return [x, y];
      });

      const dots = points
        .map(
          ([x, y]) =>
            `<circle class="chart-dot ${name}" cx="${x}" cy="${y}" r="3.5"></circle>`
        )
        .join("");

      return `
        <polyline class="trend-line ${name}" points="${createPolyline(points)}"></polyline>
        ${dots}
      `;
    })
    .join("");

  trendChart.innerHTML = `${gridLines.join("")}${marker}${lines}${labels}${rightLabels}`;
}

function renderCalendar() {
  const headers = ["日", "一", "二", "三", "四", "五", "六"];
  const cells = [];
  const monthStart = new Date(
    currentCalendarMonth.getFullYear(),
    currentCalendarMonth.getMonth(),
    1
  );
  const firstDayOffset = monthStart.getDay();
  const daysInMonth = new Date(
    currentCalendarMonth.getFullYear(),
    currentCalendarMonth.getMonth() + 1,
    0
  ).getDate();
  const previousMonthDays = new Date(
    currentCalendarMonth.getFullYear(),
    currentCalendarMonth.getMonth(),
    0
  ).getDate();
  const startMonth = new Date(
    calendarStartDate.getFullYear(),
    calendarStartDate.getMonth(),
    1
  );
  const currentMonthBoundary = getCurrentMonthBoundary();
  const currentRecordedDate = fromDateKey(getCurrentRecordedDateKey());
  const recordedEvents = getRecordedCalendarEvents();
  const eventLookup = new Map(recordedEvents.map((item) => [item.date, item]));

  calendarMonthLabel.textContent = formatCalendarMonth(currentCalendarMonth);
  calendarPrevButton.disabled = isSameMonth(currentCalendarMonth, startMonth);
  calendarNextButton.disabled = isSameMonth(currentCalendarMonth, currentMonthBoundary);

  headers.forEach((item) => {
    cells.push(`<div class="calendar-day header">${item}</div>`);
  });

  for (let day = previousMonthDays - firstDayOffset + 1; day <= previousMonthDays; day += 1) {
    cells.push(`<div class="calendar-day muted">${day}</div>`);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(
      currentCalendarMonth.getFullYear(),
      currentCalendarMonth.getMonth(),
      day
    );
    const event = eventLookup.get(toDateKey(date));
    const marker = event
      ? `<span class="event-mark ${event.type}">${event.type === "manual" ? "🫖" : "⚑"}</span>`
      : "";
    const isSelectable = date >= calendarStartDate && date <= currentRecordedDate;
    const className = [
      "calendar-day",
      isSelectable ? "selectable" : "muted",
      isSameDate(date, selectedCalendarDate) ? "active" : "",
    ]
      .filter(Boolean)
      .join(" ");

    if (isSelectable) {
      cells.push(`
        <button class="${className}" type="button" data-date="${toDateKey(date)}" aria-label="${formatFullDate(
          date
        )}">
          ${day}
          ${marker}
        </button>
      `);
    } else {
      cells.push(`
        <div class="${className}">
          ${day}
          ${marker}
        </div>
      `);
    }
  }

  const trailingDays = (7 - ((firstDayOffset + daysInMonth) % 7 || 7)) % 7;

  for (let day = 1; day <= trailingDays; day += 1) {
    cells.push(`<div class="calendar-day muted">${day}</div>`);
  }

  calendarGrid.innerHTML = cells.join("");

  const selectedEvent = eventLookup.get(toDateKey(selectedCalendarDate));

  eventHighlight.innerHTML = selectedEvent
    ? `
        <img src="headshot.png" alt="植物头像" class="highlight-avatar" />
        <div>
          <div class="highlight-time">${formatFullDate(selectedCalendarDate)} ${selectedEvent.time}</div>
          <div class="highlight-text">${selectedEvent.detail}</div>
        </div>
        <div class="highlight-arrow">›</div>
      `
    : `
        <img src="headshot.png" alt="植物头像" class="highlight-avatar" />
        <div class="highlight-empty">
          <div class="highlight-time">${formatFullDate(selectedCalendarDate)}</div>
          <div class="highlight-text">当天还没有补水记录</div>
        </div>
      `;

  const monthRecords = getMonthRecords(currentCalendarMonth)
    .filter((item) => item.date <= getCurrentRecordedDateKey())
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((item) => {
      const eventDate = fromDateKey(item.date);
      return `
        <div class="event-item">
          <strong>${formatShortDate(eventDate)} · ${item.title}</strong>
          <span>${item.detail} · ${item.time}</span>
        </div>
      `;
    });

  const visibleMonthRecords = isEventListExpanded ? monthRecords : monthRecords.slice(0, 2);

  eventList.innerHTML = visibleMonthRecords.length
    ? visibleMonthRecords.join("")
    : `
        <div class="event-item">
          <strong>${formatCalendarMonth(currentCalendarMonth)}</strong>
          <span>从 2026年7月2日 开始记录，当前月份暂无浇水事件。</span>
        </div>
      `;

  if (monthRecords.length > 2) {
    eventListToggle.classList.remove("hidden");
    eventListToggle.textContent = isEventListExpanded ? "收起记录" : "展开全部记录";
    eventListToggle.setAttribute("aria-expanded", String(isEventListExpanded));
  } else {
    eventListToggle.classList.add("hidden");
    eventListToggle.setAttribute("aria-expanded", "false");
  }
}

function hideSplash() {
  if (splashDismissed || !splashScreen) {
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

function savePlantName() {
  const nextName = plantNameInput.value.trim();

  if (!nextName) {
    plantNameInput.focus();
    return;
  }

  currentPlantName = nextName;
  updatePlantNameUI();
  renamePanel.classList.add("hidden");
  showToast("植物名称已更新");
}

function savePlantSpecies() {
  const nextSpecies = plantSpeciesInput.value.trim();

  if (!nextSpecies) {
    plantSpeciesInput.focus();
    return;
  }

  currentPlantSpecies = nextSpecies;
  updatePlantSpeciesUI();
  showToast("植物种类已更新");
}

function publishControlSafely(payload) {
  if (!window.GreenMoodMQTT || typeof window.GreenMoodMQTT.publishControl !== "function") {
    return false;
  }

  try {
    window.GreenMoodMQTT.publishControl(payload);
    return true;
  } catch (error) {
    console.warn("[GreenMoodUI] Failed to publish control payload:", error);
    return false;
  }
}

function applyTelemetryUpdate(partialTelemetry = {}, options = {}) {
  Object.assign(deviceData, partialTelemetry);
  if (typeof partialTelemetry.mode === "string" && partialTelemetry.mode.trim()) {
    currentMode = partialTelemetry.mode.trim();
  }

  if (options.updatedAt instanceof Date) {
    lastUpdatedAt = options.updatedAt;
  } else {
    lastUpdatedAt = new Date();
  }

  renderMetrics();
  renderComfort();
  updateModeUI();
  updateProfileDays();
  updateUpdatedAtLabel();
  renderCalendar();
  evaluateLowWaterAlert();
}

function createAiBubble(role, text) {
  const bubble = document.createElement("div");
  bubble.className = `ai-bubble ${role}`;
  bubble.textContent = text;
  return bubble;
}

function appendAiMessage(role, text) {
  if (!aiChatLog) {
    return;
  }

  const bubble = createAiBubble(role, text);
  aiChatLog.appendChild(bubble);
  aiChatLog.scrollTop = aiChatLog.scrollHeight;
}

function buildAiPayload(message) {
  return {
    message,
    plant_name: currentPlantName,
    plant_species: currentPlantSpecies,
    sensor_data: {
      device_id: deviceData.device_id,
      soil_moisture: deviceData.soil_moisture,
      air_humidity: deviceData.air_humidity,
      temperature: deviceData.temperature,
      light: deviceData.light,
      water_level: deviceData.water_level,
      air_quality: deviceData.air_quality,
      mode: currentMode,
      pump_status: deviceData.pump_status,
      fan_status: deviceData.fan_status,
    },
  };
}

async function requestAiReply(message) {
  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildAiPayload(message)),
  });

  if (!response.ok) {
    throw new Error(`AI request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.reply || "后端已响应，但暂时没有返回建议内容。";
}

async function handleAiSend() {
  const message = aiChatInput.value.trim();

  if (!message) {
    aiChatInput.focus();
    return;
  }

  appendAiMessage("user", message);
  aiChatInput.value = "";
  sendAiButton.disabled = true;
  sendAiButton.textContent = "思考中...";
  updateAiBackendHint("正在调用deepseek提供的大模型...");

  try {
    const reply = await requestAiReply(message);
    appendAiMessage("assistant", reply);
    updateAiBackendHint();
  } catch (error) {
    console.warn("[GreenMoodAI] request failed:", error);
    appendAiMessage(
      "assistant",
      "当前 Flask 智能对话接口暂时不可用，请先启动 app.py 后端服务。"
    );
    updateAiBackendHint("当前未成功连接本地Flask服务，deepseek对话暂不可用");
  } finally {
    sendAiButton.disabled = false;
    sendAiButton.textContent = "发送问题";
  }
}

function applyTrendUpdate(partialTrendData = {}) {
  Object.entries(partialTrendData).forEach(([rangeKey, rangeValue]) => {
    if (!trendData[rangeKey] || !rangeValue) {
      return;
    }

    trendData[rangeKey] = {
      ...trendData[rangeKey],
      ...rangeValue,
      series: {
        ...trendData[rangeKey].series,
        ...(rangeValue.series ?? {}),
      },
    };
  });

  renderChart(currentRange);
}

function applyCalendarEventUpdate(nextEvents = []) {
  calendarEvents.splice(0, calendarEvents.length, ...nextEvents);
  isEventListExpanded = false;
  renderCalendar();
}

function simulateTelemetryRefresh() {
  const nextTelemetry = {
    soil_moisture: clamp(deviceData.soil_moisture + (Math.random() > 0.5 ? 1 : -1), 30, 60),
    air_humidity: clamp(deviceData.air_humidity + (Math.random() > 0.5 ? 1 : -1), 45, 70),
    temperature: clamp(
      Number((deviceData.temperature + (Math.random() > 0.5 ? 0.2 : -0.2)).toFixed(1)),
      18,
      30
    ),
    light: clamp(deviceData.light + (Math.random() > 0.5 ? 18 : -18), 200, 1200),
    water_level: clamp(deviceData.water_level + (Math.random() > 0.5 ? 1 : 0), 40, 100),
    air_quality: clamp(deviceData.air_quality + (Math.random() > 0.5 ? 8 : -8), 300, 600),
  };

  applyTelemetryUpdate(nextTelemetry, { updatedAt: new Date() });
}

async function refreshDashboard(options = {}) {
  const { showFeedback = false } = options;

  refreshMetricsButton.disabled = true;
  refreshMetricsButton.classList.add("is-refreshing");

  try {
    if (typeof mqttBridgeState.fetchLatestTelemetry === "function") {
      const nextTelemetry = await mqttBridgeState.fetchLatestTelemetry();
      if (nextTelemetry) {
        applyTelemetryUpdate(nextTelemetry, { updatedAt: new Date() });
      } else {
        applyTelemetryUpdate({}, { updatedAt: new Date() });
      }
    } else {
      simulateTelemetryRefresh();
    }

    if (typeof mqttBridgeState.fetchLatestTrendData === "function") {
      const nextTrendData = await mqttBridgeState.fetchLatestTrendData();
      if (nextTrendData) {
        applyTrendUpdate(nextTrendData);
      }
    }

    if (typeof mqttBridgeState.fetchLatestCalendarEvents === "function") {
      const nextCalendarEvents = await mqttBridgeState.fetchLatestCalendarEvents();
      if (Array.isArray(nextCalendarEvents)) {
        applyCalendarEventUpdate(nextCalendarEvents);
      }
    }

    if (showFeedback) {
      showToast("已按北京时间刷新数据");
    }
  } finally {
    refreshMetricsButton.disabled = false;
    refreshMetricsButton.classList.remove("is-refreshing");
  }
}

// Reserved MQTT bridge for the six home metrics, trend chart data, and event records.
window.GreenMoodBridge = {
  setTelemetry(partialTelemetry) {
    applyTelemetryUpdate(partialTelemetry);
  },
  setTrendData(partialTrendData) {
    applyTrendUpdate(partialTrendData);
  },
  setCalendarEvents(nextEvents) {
    if (Array.isArray(nextEvents)) {
      applyCalendarEventUpdate(nextEvents);
    }
  },
  setFetchLatestTelemetry(handler) {
    mqttBridgeState.fetchLatestTelemetry = handler;
  },
  setFetchLatestTrendData(handler) {
    mqttBridgeState.fetchLatestTrendData = handler;
  },
  setFetchLatestCalendarEvents(handler) {
    mqttBridgeState.fetchLatestCalendarEvents = handler;
  },
  setPlantSpecies(nextSpecies) {
    if (typeof nextSpecies === "string" && nextSpecies.trim()) {
      currentPlantSpecies = nextSpecies.trim();
      updatePlantSpeciesUI();
    }
  },
  refresh() {
    return refreshDashboard();
  },
  getSnapshot() {
    return {
      telemetry: { ...deviceData },
      trendData: JSON.parse(JSON.stringify(trendData)),
      calendarEvents: [...calendarEvents],
      plantName: currentPlantName,
      plantSpecies: currentPlantSpecies,
      updatedAt: lastUpdatedAt.toISOString(),
    };
  },
};

function bindEvents() {
  if (enterAppButton) {
    enterAppButton.addEventListener("click", hideSplash);
  }
  window.setInterval(updateProfileDays, 60000);

  editNameToggle.addEventListener("click", () => {
    renamePanel.classList.toggle("hidden");

    if (!renamePanel.classList.contains("hidden")) {
      plantNameInput.focus();
      plantNameInput.select();
    }
  });

  saveNameButton.addEventListener("click", savePlantName);
  plantNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      savePlantName();
    }
  });

  savePlantSpeciesButton.addEventListener("click", savePlantSpecies);
  plantSpeciesInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      savePlantSpecies();
    }
  });

  comfortTipToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldShow = comfortTipCard.classList.contains("hidden");
    updateComfortTipVisibility(shouldShow);
  });

  comfortTipCard.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    updateComfortTipVisibility(false);
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchScreen(button.dataset.target);
    });
  });

  window.addEventListener("greenmood:mqtt-status", (event) => {
    updateMqttStatus(event.detail);
  });

  autoToggle.addEventListener("click", () => {
    currentMode = currentMode === "auto" ? "manual" : "auto";
    deviceData.mode = currentMode;
    if (currentMode === "auto") {
      deviceData.pump_status = "off";
    }
    publishControlSafely({
      device_id: deviceData.device_id,
      action: "set_mode",
      mode: currentMode,
    });
    updateModeUI();
  });

  refreshMetricsButton.addEventListener("click", () => {
    refreshDashboard({ showFeedback: true });
  });

  manualWaterButton.addEventListener("click", () => {
    if (currentMode === "auto") {
      showToast("请先关闭自动浇灌，再进行手动补水");
      return;
    }

    manualWaterButton.classList.add("is-busy");
    manualWaterButton.textContent = "发送中...";
    deviceData.pump_status = "on";
    publishControlSafely({
      device_id: deviceData.device_id,
      action: "manual_water",
      command: "start",
    });
    updateModeUI();

    window.setTimeout(() => {
      manualWaterButton.classList.remove("is-busy");
      manualWaterButton.textContent = "手动补水";
      deviceData.pump_status = "off";
      publishControlSafely({
        device_id: deviceData.device_id,
        action: "manual_water",
        command: "stop",
      });
      updateModeUI();
      showToast("已发送补水命令");
    }, 850);
  });

  manualFanButton.addEventListener("click", () => {
    if (currentMode === "auto") {
      showToast("请先关闭智能控制，再启动手动风扇");
      return;
    }

    manualFanButton.classList.add("is-busy");
    manualFanButton.textContent = "启动中...";
    deviceData.fan_status = "on";
    publishControlSafely({
      device_id: deviceData.device_id,
      action: "manual_fan",
      command: "start",
    });
    updateModeUI();

    window.setTimeout(() => {
      manualFanButton.classList.remove("is-busy");
      manualFanButton.textContent = "启动风扇";
      deviceData.fan_status = "off";
      publishControlSafely({
        device_id: deviceData.device_id,
        action: "manual_fan",
        command: "stop",
      });
      updateModeUI();
      showToast("已发送风扇命令");
    }, 850);
  });

  calendarPrevButton.addEventListener("click", () => {
    if (calendarPrevButton.disabled) {
      return;
    }

    setCalendarMonth(
      new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1)
    );
    renderCalendar();
  });

  calendarNextButton.addEventListener("click", () => {
    setCalendarMonth(
      new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1)
    );
    renderCalendar();
  });

  eventListToggle.addEventListener("click", () => {
    isEventListExpanded = !isEventListExpanded;
    renderCalendar();
  });

  calendarGrid.addEventListener("click", (event) => {
    const target = event.target.closest("[data-date]");

    if (!target) {
      return;
    }

    selectedCalendarDate = fromDateKey(target.dataset.date);
    renderCalendar();
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
      currentSuggestionIndex =
        (currentSuggestionIndex + 1) % suggestionTemplates.length;
      renderGuideText();
      simulateAiButton.classList.remove("is-loading");
      simulateAiButton.disabled = false;
    }, 700);
  });

  sendAiButton.addEventListener("click", () => {
    handleAiSend();
  });

  aiChatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAiSend();
    }
  });

  waterAlertConfirmButton.addEventListener("click", () => {
    hasAcknowledgedLowWaterAlert = true;
    updateLowWaterAlertVisibility(false);
  });
}

function init() {
  updateAiBackendHint();
  updateProfileDays();
  updateUpdatedAtLabel();
  updateComfortTipVisibility(false);
  updateMqttStatus({ status: "connecting" });
  renderMetrics();
  renderComfort();
  updatePlantNameUI();
  updatePlantSpeciesUI();
  updateModeUI();
  evaluateLowWaterAlert();
  renderChart(currentRange);
  renderCalendar();
  bindEvents();
}

init();
