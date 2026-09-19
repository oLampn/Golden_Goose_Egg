const SOULS_PER_MINUTE = 80;
const STARTING_VALUE = 400;
const HATCH_DURATION_MS = 2000;
const CLICK_GUARD_MS = 300;
const UI_UPDATE_INTERVAL_MS = 250;
const buffs = [
  { id: "fire", name: "射速", icon: "./assets/buff-fire-rate.svg", weight: 1 },
  { id: "ammo", name: "弹药量", icon: "./assets/buff-ammo.svg", weight: 1 },
  { id: "cooldown", name: "冷却缩减", icon: "./assets/buff-cooldown.svg", weight: 1 },
  { id: "weapon", name: "武器伤害", icon: "./assets/buff-weapon.svg", weight: 1 },
  { id: "health", name: "最大生命", icon: "./assets/buff-health.svg", weight: 2 },
  { id: "spirit", name: "元灵力量", icon: "./assets/buff-spirit.svg", weight: 1 }
];

const state = {
  phase: "ready",
  mode: "infinite",
  targetMinutes: 30,
  paused: false,
  timerReady: false,
  hatching: false,
  hatchStartedAt: null,
  pausedBeforeHatch: false,
  activeSeconds: 0,
  lastTick: null,
  rewards: []
};

const $ = selector => document.querySelector(selector);
const soulValue = $("#soulValue");
const heldTime = $("#heldTime");
const accruedSouls = $("#accruedSouls");
const buffCount = $("#buffCount");
const growthFill = $("#growthFill");
const progressLabel = $("#progressLabel");
const progressTime = $("#progressTime");
const primaryAction = $("#primaryAction");
const lifeToggle = $("#lifeToggle");
const skipMinute = $("#skipMinute");
const eggButton = $("#eggButton");
const eggState = $("#eggState");
const hatchDialog = $("#hatchDialog");
const timerDialog = $("#timerDialog");
const cancelDialog = $("#cancelDialog");
const timerHatchButton = $("#timerHatchButton");
const targetMinutes = $("#targetMinutes");
const timerConfig = $("#timerConfig");
const hint = $("#hint");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
let audioContext;
let hatchAnimationFrame = null;
const lastButtonClick = new WeakMap();

function setText(element, value) {
  if (element.textContent !== value) element.textContent = value;
}

function setMarkup(element, value) {
  if (element.innerHTML !== value) element.innerHTML = value;
}

function setProgress(element, value) {
  const next = String(Math.max(0, Math.min(1, value)));
  if (element.style.getPropertyValue("--progress") !== next) {
    element.style.setProperty("--progress", next);
  }
}

function onGuardedClick(button, handler) {
  button.addEventListener("click", event => {
    const now = performance.now();
    const last = lastButtonClick.get(button) ?? -Infinity;
    if (now - last < CLICK_GUARD_MS) {
      event.preventDefault();
      return;
    }
    lastButtonClick.set(button, now);
    handler(event);
  });
}

function accrued() {
  return Math.floor(state.activeSeconds * SOULS_PER_MINUTE / 60);
}

function formatTime(seconds) {
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getAudioContext() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  audioContext ||= new AudioCtor();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(frequency, start, duration, type = "sine", volume = 0.08) {
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function purchaseSound() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  tone(392, now, .16, "triangle", .055);
  tone(659.25, now + .09, .26, "sine", .075);
}

function hatchSound() {
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    tone(frequency, now + index * .075, .34, index < 2 ? "triangle" : "sine", .065);
  });
  tone(1567.98, now + .34, .7, "sine", .04);
}

function render() {
  const earned = accrued();
  const count = Math.floor(earned / SOULS_PER_MINUTE);
  const active = state.phase === "holding";
  const targetSeconds = state.targetMinutes * 60;

  setText(soulValue, String(STARTING_VALUE + earned));
  setText(heldTime, formatTime(state.activeSeconds));
  setText(accruedSouls, `${earned} 魂魄`);
  setText(buffCount, `${count} 个`);

  if (state.mode === "timer") {
    setProgress(growthFill, state.activeSeconds / targetSeconds);
    setText(progressLabel, "定时孵化");
    setText(progressTime, `${formatTime(state.activeSeconds)} / ${formatTime(targetSeconds)}`);
  } else {
    const cycleSeconds = state.activeSeconds % 60;
    setProgress(growthFill, cycleSeconds / 60);
    setText(progressLabel, "下一次增益");
    setText(progressTime, formatTime(cycleSeconds === 0 && state.activeSeconds > 0 ? 60 : 60 - cycleSeconds));
  }

  setMarkup(primaryAction, active
    ? state.hatching
      ? `<span class="channel-label">孵化中 · 空格取消</span>`
      : `<span class="action-label">孵化鹅蛋 <kbd>Z</kbd></span><span>${STARTING_VALUE + earned}</span>`
    : `${state.phase === "hatched" ? "再买一颗" : "购入金鹅蛋"} <span>800</span>`);
  primaryAction.classList.toggle("danger-action", active);
  primaryAction.classList.toggle("channeling", state.hatching);
  timerHatchButton.classList.toggle("channeling", state.hatching);
  setMarkup(timerHatchButton, state.hatching
    ? `<span class="channel-label">孵化中 · 空格取消</span>`
    : `<span class="action-label">孵化鹅蛋 <kbd>Z</kbd></span>`);
  lifeToggle.disabled = !active || state.timerReady || state.hatching;
  skipMinute.disabled = !active || state.timerReady || state.hatching;
  setText(lifeToggle, state.paused ? "继续孵化" : "暂停孵化");
  lifeToggle.classList.toggle("paused", state.paused);
  eggButton.classList.toggle("holding", active && !state.paused && !state.hatching && !cancelDialog.open);
  setText(eggState, !active
    ? "尚未购入"
    : state.hatching
      ? "正在孵化 · 空格取消"
    : state.timerReady
      ? "时间已到 · 等待孵化"
    : state.paused
      ? "孵化暂停"
      : state.mode === "timer"
        ? `定时孵化 · ${state.targetMinutes} 分钟`
        : `无限孵化 · ${SOULS_PER_MINUTE}/分钟`);
  eggButton.setAttribute("aria-label", active ? "取消金鹅蛋计时" : "购买金鹅蛋");

  modeButtons.forEach(button => {
    const selected = button.dataset.mode === state.mode;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
    button.disabled = active;
  });
  timerConfig.hidden = state.mode !== "timer";
  targetMinutes.disabled = active;
  setText(hint, state.mode === "timer"
    ? `达到 ${state.targetMinutes} 分钟后会提醒你点击孵化；也可以提前孵化。`
    : "无限模式下，进度条每分钟循环一次；你可以随时孵化。");
}

function updateHatchProgress(now) {
  if (!state.hatching || state.hatchStartedAt === null) return;
  const progress = Math.min(1, (now - state.hatchStartedAt) / HATCH_DURATION_MS);
  const button = timerDialog.open ? timerHatchButton : primaryAction;
  button.style.setProperty("--hatch-progress", String(progress));
}

function animateHatch(now) {
  if (!state.hatching || state.hatchStartedAt === null) {
    hatchAnimationFrame = null;
    return;
  }
  updateHatchProgress(now);
  if (now - state.hatchStartedAt >= HATCH_DURATION_MS) {
    hatchAnimationFrame = null;
    completeHatch();
    return;
  }
  hatchAnimationFrame = requestAnimationFrame(animateHatch);
}

function clearBuffResults() {
  document.querySelectorAll("#buffGrid article").forEach(card => {
    card.classList.remove("won");
    card.querySelector("strong").textContent = "等待孵化";
  });
}

function buyEgg() {
  state.phase = "holding";
  state.paused = false;
  state.timerReady = false;
  state.hatching = false;
  state.hatchStartedAt = null;
  state.pausedBeforeHatch = false;
  state.activeSeconds = 0;
  state.lastTick = performance.now();
  state.rewards = [];
  clearBuffResults();
  purchaseSound();
  render();
}

function pickBuff() {
  const weighted = buffs.flatMap(buff => Array(buff.weight).fill(buff));
  return weighted[Math.floor(Math.random() * weighted.length)];
}

function beginHatch() {
  if (state.phase !== "holding" || state.hatching) return;
  state.pausedBeforeHatch = state.paused;
  state.paused = true;
  state.hatching = true;
  state.hatchStartedAt = performance.now();
  state.lastTick = state.hatchStartedAt;
  render();
  updateHatchProgress(state.hatchStartedAt);
  hatchAnimationFrame = requestAnimationFrame(animateHatch);
}

function cancelHatch() {
  if (!state.hatching) return;
  state.hatching = false;
  state.hatchStartedAt = null;
  if (hatchAnimationFrame !== null) cancelAnimationFrame(hatchAnimationFrame);
  hatchAnimationFrame = null;
  state.paused = state.pausedBeforeHatch;
  state.lastTick = performance.now();
  render();
}

function showCancelDialog() {
  if (state.phase !== "holding" || cancelDialog.open) return;
  if (state.hatching) cancelHatch();
  document.body.classList.add("cancel-modal-open");
  cancelDialog.showModal();
  render();
}

function dismissCancelDialog() {
  if (cancelDialog.open) cancelDialog.close();
  document.body.classList.remove("cancel-modal-open");
  render();
  if (state.timerReady && !timerDialog.open) timerDialog.showModal();
}

function cancelEgg() {
  if (state.phase !== "holding") return;
  if (cancelDialog.open) cancelDialog.close();
  document.body.classList.remove("cancel-modal-open");
  if (timerDialog.open) timerDialog.close();
  state.phase = "ready";
  state.paused = false;
  state.timerReady = false;
  state.hatching = false;
  state.hatchStartedAt = null;
  state.pausedBeforeHatch = false;
  state.activeSeconds = 0;
  state.lastTick = null;
  state.rewards = [];
  eggButton.classList.remove("holding", "hatching");
  clearBuffResults();
  render();
}

function completeHatch() {
  if (state.phase !== "holding" || !state.hatching) return;
  if (timerDialog.open) timerDialog.close();
  state.hatching = false;
  state.hatchStartedAt = null;
  if (hatchAnimationFrame !== null) cancelAnimationFrame(hatchAnimationFrame);
  hatchAnimationFrame = null;
  state.timerReady = false;
  const earned = accrued();
  const count = Math.floor(earned / SOULS_PER_MINUTE);
  state.rewards = Array.from({ length: count }, pickBuff);
  state.phase = "hatched";
  hatchSound();
  eggButton.classList.remove("holding");
  eggButton.classList.add("hatching");
  $("#resultTitle").textContent = state.activeSeconds > 60 * 60
    ? "鹅蛋孵化了，但是..."
    : "鹅蛋孵化了。";
  $("#resultSouls").textContent = String(STARTING_VALUE + earned);

  const totals = state.rewards.reduce((map, buff) => map.set(buff.id, (map.get(buff.id) || 0) + 1), new Map());
  $("#resultBuffs").innerHTML = count
    ? buffs.filter(buff => totals.has(buff.id)).map(buff => `<span><img src="${buff.icon}" alt="">${buff.name} × ${totals.get(buff.id)}</span>`).join("")
    : "<span>尚未积累永久增益</span>";

  buffs.forEach(buff => {
    const card = document.querySelector(`[data-buff="${buff.id}"]`);
    const total = totals.get(buff.id) || 0;
    card.classList.toggle("won", total > 0);
    card.querySelector("strong").textContent = total ? `获得 × ${total}` : "本次未获得";
  });

  render();
  setTimeout(() => {
    eggButton.classList.remove("hatching");
    hatchDialog.showModal();
  }, 700);
}

function action() {
  if (state.hatching) cancelHatch();
  else if (state.phase === "holding") beginHatch();
  else buyEgg();
}

function timerHatchAction() {
  if (state.hatching) cancelHatch();
  else beginHatch();
}

function eggAction() {
  if (state.phase === "holding") showCancelDialog();
  else buyEgg();
}

onGuardedClick(primaryAction, action);
onGuardedClick(eggButton, eggAction);
onGuardedClick(lifeToggle, () => {
  state.paused = !state.paused;
  state.lastTick = performance.now();
  render();
});
onGuardedClick(skipMinute, () => {
  state.activeSeconds += 60;
  finishTimerIfNeeded();
  render();
});
document.querySelectorAll("[data-mode]").forEach(button => onGuardedClick(button, () => {
  if (state.phase === "holding") return;
  state.mode = button.dataset.mode;
  render();
}));
targetMinutes.addEventListener("change", () => {
  state.targetMinutes = Math.max(1, Math.min(180, Number(targetMinutes.value) || 30));
  targetMinutes.value = String(state.targetMinutes);
  render();
});
onGuardedClick($("#topButton"), () => window.scrollTo({ top: 0, behavior: "smooth" }));
onGuardedClick($("#closeDialog"), () => hatchDialog.close());
onGuardedClick(timerHatchButton, timerHatchAction);
onGuardedClick($("#confirmCancel"), cancelEgg);
onGuardedClick($("#dismissCancel"), dismissCancelDialog);
hatchDialog.addEventListener("click", event => {
  if (event.target === hatchDialog) hatchDialog.close();
});
cancelDialog.addEventListener("click", event => {
  if (event.target === cancelDialog) dismissCancelDialog();
});
cancelDialog.addEventListener("cancel", event => {
  event.preventDefault();
  dismissCancelDialog();
});

document.addEventListener("keydown", event => {
  const target = event.target;
  const typing = target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable);
  if (!typing && event.code === "Space" && state.hatching) {
    event.preventDefault();
    cancelHatch();
    return;
  }
  if (!typing && event.key.toLowerCase() === "z" && state.phase === "holding") {
    event.preventDefault();
    beginHatch();
  }
});

function finishTimerIfNeeded() {
  if (state.mode !== "timer" || state.timerReady || state.activeSeconds < state.targetMinutes * 60) return;
  state.activeSeconds = state.targetMinutes * 60;
  state.paused = true;
  state.timerReady = true;
  if (!timerDialog.open && !cancelDialog.open) timerDialog.showModal();
}

function tick() {
  const now = performance.now();
  if (state.phase === "holding") {
    if (state.lastTick === null) state.lastTick = now;
    if (!state.paused) state.activeSeconds += Math.max(0, (now - state.lastTick) / 1000);
    state.lastTick = now;
    finishTimerIfNeeded();
    render();
  }
}

render();
setInterval(tick, UI_UPDATE_INTERVAL_MS);
