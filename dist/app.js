const HEROES = [
  { name: "Abrams", code: "AB", role: "近战前排", threats: { melee: 3, cc: 2, sustain: 2, burst: 1 } },
  { name: "Bebop", code: "BE", role: "抓取爆发", threats: { spirit: 2, cc: 3, burst: 3, dive: 1 } },
  { name: "Dynamo", code: "DY", role: "团控支援", threats: { spirit: 2, cc: 3, area: 3, support: 2 } },
  { name: "Grey Talon", code: "GT", role: "远程灵术", threats: { spirit: 3, range: 3, burst: 2 } },
  { name: "Haze", code: "HA", role: "枪械刺客", threats: { bullet: 3, dive: 3, cc: 2, burst: 2 } },
  { name: "Infernus", code: "IN", role: "持续灵伤", threats: { spirit: 3, sustain: 2, heal: 2, area: 1 } },
  { name: "Ivy", code: "IV", role: "枪械支援", threats: { bullet: 2, support: 3, cc: 2, area: 1 } },
  { name: "Kelvin", code: "KE", role: "减速支援", threats: { spirit: 2, slow: 3, support: 2, heal: 2 } },
  { name: "Lash", code: "LA", role: "突进爆发", threats: { burst: 3, cc: 2, dive: 3, spirit: 2 } },
  { name: "Mo & Krill", code: "MK", role: "控制前排", threats: { cc: 3, melee: 2, sustain: 2, spirit: 1 } },
  { name: "Pocket", code: "PO", role: "灵术刺客", threats: { spirit: 3, burst: 3, dive: 3, area: 1 } },
  { name: "Seven", code: "SE", role: "范围灵术", threats: { spirit: 3, area: 3, cc: 2 } },
  { name: "Shiv", code: "SH", role: "续航收割", threats: { sustain: 3, dive: 2, burst: 2, heal: 2 } },
  { name: "Vindicta", code: "VI", role: "远程枪械", threats: { bullet: 3, range: 3, burst: 2 } },
  { name: "Warden", code: "WA", role: "追击控制", threats: { cc: 3, chase: 3, burst: 2, spirit: 1 } },
  { name: "Wraith", code: "WR", role: "枪械突进", threats: { bullet: 3, cc: 2, dive: 2, burst: 2 } }
];

const ITEMS = [
  { name: "Rusted Barrel", code: "RB", type: "Spirit", cost: 800, active: true, counters: { bullet: 3, range: 1 }, phases: { lane: 3, mid: 1, late: 0 }, use: "先手点给依赖射速的核心，覆盖其输出窗口。", reason: "低成本压低敌方射速，并削弱枪械对拼能力。" },
  { name: "Debuff Reducer", code: "DR", type: "Vitality", cost: 1600, active: false, counters: { cc: 3, slow: 2, chase: 1 }, phases: { lane: 2, mid: 3, late: 1 }, use: "无需主动操作；在关键控制命中后为你争取脱身时间。", reason: "缩短控制与减速持续时间，是面对多控制阵容的高效中期保险。" },
  { name: "Reactive Barrier", code: "RB", type: "Vitality", cost: 1600, active: false, counters: { cc: 3, burst: 2, dive: 1 }, phases: { lane: 3, mid: 2, late: 0 }, use: "让对手先交控制触发屏障，再决定反打或撤退。", reason: "被控制时提供生存缓冲，适合频繁被先手的对线与小规模团战。" },
  { name: "Return Fire", code: "RF", type: "Vitality", cost: 1600, active: true, counters: { bullet: 3, dive: 2, range: 1 }, phases: { lane: 1, mid: 3, late: 2 }, use: "敌方枪械核心开火或突脸时开启，不要在其换弹期浪费。", reason: "逼迫持续枪械输出者停火或承担反伤，主动窗口价值很高。" },
  { name: "Healbane", code: "HB", type: "Vitality", cost: 1600, active: false, counters: { heal: 3, sustain: 3, support: 2 }, phases: { lane: 2, mid: 3, late: 2 }, use: "优先攻击回复核心，确保减疗效果覆盖其治疗窗口。", reason: "限制吸血、治疗与长时间拉扯，阻止高续航目标重置战斗。" },
  { name: "Counterspell", code: "CS", type: "Vitality", cost: 3200, active: true, counters: { spirit: 3, burst: 3, cc: 2 }, phases: { lane: 0, mid: 3, late: 3 }, use: "预判关键技能落点开启，留给对方最致命的一次法术。", reason: "提供一次关键法术应对窗口，适合处理可预判的灵术爆发或控制。" },
  { name: "Dispel Magic", code: "DM", type: "Vitality", cost: 3200, active: true, counters: { cc: 3, slow: 3, spirit: 1 }, phases: { lane: 0, mid: 3, late: 3 }, use: "被关键负面效果命中后立即使用，避免与其他保命手段重叠。", reason: "主动清除负面效果，直接解决会决定生死的控制或持续减益。" },
  { name: "Metal Skin", code: "MS", type: "Vitality", cost: 3200, active: true, counters: { bullet: 5, melee: 2, dive: 2 }, phases: { lane: 0, mid: 3, late: 4 }, use: "等枪械核心承诺输出后再开；持续期间转身压迫或找掩体。", reason: "短时间免疫枪械伤害，是对抗成型枪核最直接的硬反制。" },
  { name: "Bullet Resilience", code: "BR", type: "Vitality", cost: 3200, active: false, counters: { bullet: 4, range: 2 }, phases: { lane: 0, mid: 3, late: 3 }, use: "持续生效，适合需要长期暴露在火线中的英雄。", reason: "稳定缓解枪械伤害，面对双枪核时比短暂保命更持续。" },
  { name: "Spirit Resilience", code: "SR", type: "Vitality", cost: 3200, active: false, counters: { spirit: 4, area: 2, burst: 1 }, phases: { lane: 0, mid: 3, late: 3 }, use: "持续生效；配合走位减少吃满范围技能的时间。", reason: "稳定降低灵术压力，适合敌方多名灵术输出同时成型的局面。" },
  { name: "Warp Stone", code: "WS", type: "Weapon", cost: 3200, active: true, counters: { dive: 3, chase: 3, area: 2, melee: 2 }, phases: { lane: 0, mid: 3, late: 3 }, use: "保留位移穿过掩体或拉开高低差，不要只用来赶路。", reason: "主动位移能打断对方贴身节奏，也能快速离开致命范围技能。" },
  { name: "Rescue Beam", code: "RE", type: "Vitality", cost: 3200, active: true, counters: { dive: 2, burst: 2, support: 2 }, phases: { lane: 0, mid: 2, late: 3 }, use: "队友被集火但尚未被秒时拉回，注意提前站在安全角度。", reason: "为团队提供救援与重定位，能拆解对手的单点集火计划。" },
  { name: "Fortitude", code: "FO", type: "Vitality", cost: 3200, active: false, counters: { range: 2, sustain: 2, burst: 1 }, phases: { lane: 0, mid: 2, late: 2 }, use: "利用脱战恢复重新进场，避免残血强行接第二轮技能。", reason: "提升拉扯容错，适合需要多次进出战场的中远程对局。" },
  { name: "Unstoppable", code: "UN", type: "Vitality", cost: 6400, active: true, counters: { cc: 5, slow: 3, chase: 2 }, phases: { lane: 0, mid: 1, late: 5 }, use: "进场或开启持续大招前使用，避免被第一时间打断。", reason: "高价但能保护关键输出窗口，对重控制阵容具有决定性价值。" },
  { name: "Spellbreaker", code: "SB", type: "Vitality", cost: 6400, active: false, counters: { spirit: 5, burst: 4 }, phases: { lane: 0, mid: 1, late: 5 }, use: "保持屏障用于对方核心爆发，不要用身体试探无关消耗。", reason: "为后期灵术爆发提供强力防线，减少被先手秒杀的风险。" },
  { name: "Plated Armor", code: "PA", type: "Vitality", cost: 6400, active: false, counters: { bullet: 5, range: 4, burst: 2 }, phases: { lane: 0, mid: 1, late: 5 }, use: "持续生效；仍要利用掩体，避免同时承受多名枪手火力。", reason: "后期对抗重枪械阵容的高阶耐久选择，尤其克制大额单发伤害。" },
  { name: "Inhibitor", code: "IH", type: "Weapon", cost: 6400, active: false, counters: { bullet: 2, sustain: 2, dive: 2, chase: 2 }, phases: { lane: 0, mid: 1, late: 4 }, use: "持续命中敌方主力输出，让减伤效果稳定留在关键目标上。", reason: "攻击同时压低目标输出，适合后期需要边打边限制核心的英雄。" },
  { name: "Colossus", code: "CO", type: "Vitality", cost: 6400, active: true, counters: { melee: 4, area: 2, cc: 2, burst: 2 }, phases: { lane: 0, mid: 1, late: 4 }, use: "敌方近战集火或准备承受范围爆发时开启。", reason: "强化正面承伤与占位能力，帮助前排顶住近战集火。" }
];

const THREAT_LABELS = {
  bullet: "枪械输出", spirit: "灵术伤害", cc: "硬控链", dive: "突进切入", sustain: "持续作战",
  burst: "瞬间爆发", heal: "治疗回复", area: "范围压制", range: "远程消耗", melee: "近身压迫",
  slow: "减速限制", chase: "追击能力", support: "团队支援"
};

const PLAYER_PROFILES = {
  Haze: { tags: ["bullet", "dive"], note: "保命主动会占用操作窗口，优先选能在睡眠或大招前预开的装备。" },
  Abrams: { tags: ["melee", "sustain"], note: "你需要持续贴身，长期抗性通常比一次性逃生更有价值。" },
  Dynamo: { tags: ["support", "area"], note: "保住开团技能与救援位置，往往比追求个人伤害更重要。" },
  Pocket: { tags: ["spirit", "dive"], note: "优先保住撤离路径，避免主动装备与技能无敌窗口重叠。" }
};

const state = {
  player: "Haze",
  enemies: ["Abrams", "Haze", "Seven"],
  phase: "mid",
  budget: 6400,
  activeOnly: false,
  purchased: new Set()
};

const $ = (selector) => document.querySelector(selector);
const formatSouls = (value) => new Intl.NumberFormat("zh-CN").format(value);
const heroByName = (name) => HEROES.find((hero) => hero.name === name);

function getThreats() {
  const totals = {};
  state.enemies.forEach((name) => {
    const hero = heroByName(name);
    Object.entries(hero?.threats || {}).forEach(([tag, value]) => { totals[tag] = (totals[tag] || 0) + value; });
  });
  return totals;
}

function scoreItems() {
  const threats = getThreats();
  const profile = PLAYER_PROFILES[state.player] || { tags: [], note: "先解决敌方最高威胁，再根据自己的进场方式选择主动装备。" };
  return ITEMS.map((item) => {
    let score = (item.phases[state.phase] || 0) * 2.2;
    const matched = [];
    Object.entries(item.counters).forEach(([tag, strength]) => {
      if (threats[tag]) {
        score += threats[tag] * strength;
        matched.push({ tag, value: threats[tag] * strength });
      }
    });
    profile.tags.forEach((tag) => {
      if (["dive", "melee", "support"].includes(tag) && item.counters[tag]) score += 2;
    });
    if (item.cost > state.budget) score -= Math.min(7, (item.cost - state.budget) / 800);
    if (state.purchased.has(item.name)) score -= 100;
    return { ...item, score, matched: matched.sort((a,b) => b.value - a.value) };
  }).filter((item) => !state.activeOnly || item.active).sort((a,b) => b.score - a.score);
}

function renderPickers() {
  const player = heroByName(state.player);
  $("#playerAvatar").textContent = player.code;
  $("#playerName").textContent = player.name;
  $("#playerPicker").innerHTML = HEROES.map((hero) => `
    <button type="button" class="picker-option ${hero.name === state.player ? "selected" : ""}" data-player="${hero.name}" role="option" aria-selected="${hero.name === state.player}">
      <span class="hero-avatar">${hero.code}</span><span><strong>${hero.name}</strong><small>${hero.role}</small></span>
    </button>`).join("");

  $("#enemyGrid").innerHTML = HEROES.map((hero) => {
    const selected = state.enemies.includes(hero.name);
    return `<button type="button" class="picker-option ${selected ? "selected" : ""}" data-enemy="${hero.name}" aria-pressed="${selected}">
      <span class="hero-avatar">${hero.code}</span><span><strong>${hero.name}</strong><small>${hero.role}</small></span>
    </button>`;
  }).join("");

  $("#enemyAvatars").innerHTML = state.enemies.slice(0,4).map((name) => `<span class="hero-avatar" title="${name}">${heroByName(name).code}</span>`).join("");
  $("#enemyNames").textContent = state.enemies.length ? state.enemies.join(" · ") : "尚未选择";
  $("#enemyCount").textContent = `${state.enemies.length} / 6`;
}

function renderThreats() {
  const threats = getThreats();
  const sorted = Object.entries(threats).sort((a,b) => b[1] - a[1]);
  const max = Math.max(1, ...sorted.map(([,value]) => value));
  const top = sorted.slice(0,5);
  $("#threatBars").innerHTML = top.length ? top.map(([tag,value], index) => `
    <div class="bar-row ${index === 0 ? "danger" : index < 3 ? "medium" : ""}">
      <div class="bar-head"><span>${THREAT_LABELS[tag]}</span><span>${value.toString().padStart(2,"0")}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(12, value/max*100)}%"></div></div>
    </div>`).join("") : `<p class="intro">选择敌方英雄后分析威胁。</p>`;

  const pressure = sorted.reduce((sum,[,value]) => sum + value, 0);
  $("#threatLevel").textContent = pressure >= 25 ? "高压" : pressure >= 14 ? "中等" : "较低";
  $("#threatLevel").style.color = pressure >= 25 ? "var(--orange)" : pressure >= 14 ? "var(--yellow)" : "var(--lime)";

  const topTags = top.slice(0,3).map(([tag]) => THREAT_LABELS[tag]);
  $("#threatReadout").innerHTML = `<strong>扫描结论</strong><p>${state.enemies.length ? `对面主要压力来自 ${topTags.join("、")}。推荐会优先覆盖这些维度，同时避免为了单一对手过度投资。` : "至少选择一名敌方英雄，才能生成针对性结论。"}</p><div>${state.enemies.map(name => `<span class="target-chip">${name}</span>`).join("")}</div>`;
  const profile = PLAYER_PROFILES[state.player] || { note: "先解决敌方最高威胁，再根据自己的进场方式选择主动装备。" };
  $("#quickTipText").textContent = profile.note;
}

function targetNamesForItem(item) {
  return state.enemies.map((name) => {
    const hero = heroByName(name);
    const impact = Object.entries(item.counters).reduce((sum,[tag,strength]) => sum + (hero.threats[tag] || 0) * strength, 0);
    return { name, impact };
  }).filter((x) => x.impact > 0).sort((a,b) => b.impact - a.impact).slice(0,2).map((x) => x.name);
}

function renderRecommendations() {
  const scored = scoreItems();
  const visible = scored.filter((item) => !state.purchased.has(item.name)).slice(0,7);
  $("#resultCount").textContent = `${visible.length} 项`;
  $("#emptyState").hidden = visible.length > 0;
  $("#itemList").hidden = visible.length === 0;

  let running = 0;
  $("#planSummary").innerHTML = visible.slice(0,6).map((item,index) => {
    running += item.cost;
    return `<div class="plan-step ${running > state.budget ? "beyond" : ""}"><small>${String(index+1).padStart(2,"0")} · ${item.type}</small><strong>${item.name}</strong><span>${formatSouls(item.cost)} 魂</span></div>`;
  }).join("");

  $("#itemList").innerHTML = visible.map((item,index) => {
    const targets = targetNamesForItem(item);
    const affordable = item.cost <= state.budget;
    return `<article class="item-card" data-item="${item.name}">
      <div class="item-icon">${item.code}</div>
      <div class="item-title"><small>${item.type} · ${item.active ? "主动" : "被动"}${index === 0 ? '<span class="priority-badge">首选</span>' : ""}</small><strong>${item.name}</strong><span>${formatSouls(item.cost)} 魂 ${affordable ? "· 可购买" : "· 需攒钱"}</span></div>
      <div class="item-reason"><strong>${item.reason}</strong><br>${item.use}</div>
      <div class="item-targets"><small>主要针对</small>${targets.length ? targets.map(name => `<span class="target-chip">${name}</span>`).join("") : '<span class="target-chip">通用局势</span>'}</div>
      <button class="buy-button" type="button" data-buy="${item.name}">${state.purchased.has(item.name) ? "已购买" : "标记已购"}</button>
    </article>`;
  }).join("");
}

function render() {
  $("#budgetValue").textContent = formatSouls(state.budget);
  renderPickers();
  renderThreats();
  renderRecommendations();
}

function togglePicker(selector, button) {
  const picker = $(selector);
  const willOpen = picker.hidden;
  $("#playerPicker").hidden = true;
  $("#enemyPicker").hidden = true;
  $("#playerSelector").setAttribute("aria-expanded", "false");
  $("#enemySelector").setAttribute("aria-expanded", "false");
  picker.hidden = !willOpen;
  button.setAttribute("aria-expanded", String(willOpen));
}

$("#playerSelector").addEventListener("click", () => togglePicker("#playerPicker", $("#playerSelector")));
$("#enemySelector").addEventListener("click", () => togglePicker("#enemyPicker", $("#enemySelector")));
$("#playerPicker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-player]");
  if (!button) return;
  state.player = button.dataset.player;
  $("#playerPicker").hidden = true;
  $("#playerSelector").setAttribute("aria-expanded", "false");
  render();
});
$("#enemyGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-enemy]");
  if (!button) return;
  const name = button.dataset.enemy;
  if (state.enemies.includes(name)) state.enemies = state.enemies.filter((item) => item !== name);
  else if (state.enemies.length < 6) state.enemies.push(name);
  state.purchased.clear();
  render();
  $("#enemyPicker").hidden = false;
  $("#enemySelector").setAttribute("aria-expanded", "true");
});
$("#phaseTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-phase]");
  if (!button) return;
  state.phase = button.dataset.phase;
  document.querySelectorAll("[data-phase]").forEach((item) => item.classList.toggle("active", item === button));
  renderRecommendations();
});
$("#budgetRange").addEventListener("input", (event) => {
  state.budget = Number(event.target.value);
  $("#budgetValue").textContent = formatSouls(state.budget);
  renderRecommendations();
});
$("#activeOnly").addEventListener("change", (event) => {
  state.activeOnly = event.target.checked;
  renderRecommendations();
});
$("#itemList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-buy]");
  if (!button) return;
  const name = button.dataset.buy;
  state.purchased.add(name);
  renderRecommendations();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".hero-control")) {
    $("#playerPicker").hidden = true;
    $("#playerSelector").setAttribute("aria-expanded", "false");
  }
  if (!event.target.closest(".enemy-control")) {
    $("#enemyPicker").hidden = true;
    $("#enemySelector").setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    $("#playerPicker").hidden = true;
    $("#enemyPicker").hidden = true;
    $("#playerSelector").setAttribute("aria-expanded", "false");
    $("#enemySelector").setAttribute("aria-expanded", "false");
  }
});

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const update = () => render();
  const register = (tool) => Promise.resolve(context.registerTool(tool)).catch(() => {});
  register({
    name: "configure_counter_build",
    title: "配置反制配装",
    description: "设置己方英雄、敌方英雄、对局阶段和预算，并更新页面上的反制装备建议。",
    inputSchema: {
      type: "object",
      properties: {
        player: { type: "string", enum: HEROES.map((hero) => hero.name) },
        enemies: { type: "array", minItems: 1, maxItems: 6, uniqueItems: true, items: { type: "string", enum: HEROES.map((hero) => hero.name) } },
        phase: { type: "string", enum: ["lane", "mid", "late"] },
        budget: { type: "integer", minimum: 800, maximum: 16000, multipleOf: 800 }
      },
      required: ["player", "enemies", "phase", "budget"],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || !HEROES.some((h) => h.name === input.player) || !Array.isArray(input.enemies) || input.enemies.length < 1 || input.enemies.length > 6 || input.enemies.some((name) => !HEROES.some((h) => h.name === name)) || !["lane","mid","late"].includes(input.phase) || !Number.isInteger(input.budget) || input.budget < 800 || input.budget > 16000 || input.budget % 800 !== 0) throw new Error("无效的对局配置");
      state.player = input.player;
      state.enemies = [...new Set(input.enemies)];
      state.phase = input.phase;
      state.budget = input.budget;
      state.purchased.clear();
      $("#budgetRange").value = String(input.budget);
      document.querySelectorAll("[data-phase]").forEach((button) => button.classList.toggle("active", button.dataset.phase === input.phase));
      update();
      return { player: state.player, enemies: state.enemies, phase: state.phase, budget: state.budget, topRecommendation: scoreItems()[0]?.name || null };
    }
  });
  register({
    name: "read_counter_build",
    title: "读取反制配装",
    description: "读取当前页面配置、主要威胁和排名靠前的装备建议，不更改页面状态。",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      const threats = Object.entries(getThreats()).sort((a,b) => b[1]-a[1]).slice(0,3).map(([tag,value]) => ({ threat: THREAT_LABELS[tag], value }));
      const recommendations = scoreItems().filter((item) => !state.purchased.has(item.name)).slice(0,5).map((item) => ({ name: item.name, cost: item.cost, active: item.active, reason: item.reason }));
      return { player: state.player, enemies: state.enemies, phase: state.phase, budget: state.budget, threats, recommendations };
    }
  });
}

render();
registerWebMCP();
