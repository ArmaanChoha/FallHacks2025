// --- State ---
let total = 0;
const log = []; // {name, kcal}

// --- Elements ---
const maintenanceEl = document.getElementById("maintenance");
const weightEl = document.getElementById("weight");
const unitsEl = document.getElementById("units");
const exerciseEl = document.getElementById("exercise");

const foodEl = document.getElementById("food");
const servingsEl = document.getElementById("servings");
const addBtn = document.getElementById("addFood");
const clearBtn = document.getElementById("clearLog");

const totalEl = document.getElementById("total");
const alertEl = document.getElementById("alert");
const maintNoteEl = document.getElementById("maintNote");
const logEl = document.getElementById("log");

// --- Helpers ---
function render() {
  totalEl.textContent = total.toFixed(0);

  // Render maintenance note
  const maint = Number(maintenanceEl.value || 0);
  if (maint > 0) {
    maintNoteEl.textContent = `| Maintenance: ${maint.toFixed(0)} kcal`;
  } else {
    maintNoteEl.textContent = "";
  }

  // Render list
  logEl.innerHTML = "";
  log.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span><span>${item.kcal} kcal <button data-i="${idx}">✕</button></span>`;
    logEl.appendChild(li);
  });

  // Over / under maintenance message
  if (maint > 0 && total > maint) {
    const over = total - maint;
    const minutes = estimateMinutes(over);
    alertEl.classList.remove("hidden");
    alertEl.textContent = minutes
      ? `You’re over by ${over.toFixed(0)} kcal. Estimated ~${minutes.toFixed(0)} minutes of your selected exercise to offset.`
      : `You’re over by ${over.toFixed(0)} kcal. Pick an exercise + enter weight to estimate minutes to offset.`;
  } else {
    alertEl.classList.add("hidden");
    alertEl.textContent = "";
  }
}

function estimateMinutes(excessKcal) {
  // kcal/min ≈ MET * 3.5 * weight(kg) / 200
  const met = Number(exerciseEl.value || 0);
  let w = Number(weightEl.value || 0);
  if (!met || !w) return null;
  if (unitsEl.value === "lb") w = w / 2.20462;
  const kcalPerMin = (met * 3.5 * w) / 200;
  if (kcalPerMin <= 0) return null;
  return excessKcal / kcalPerMin;
}

function addFood() {
  const kcalPer = Number(foodEl.value || 0);
  if (!kcalPer) return;
  const servings = Math.max(1, Number(servingsEl.value || 1));
  const kcal = Math.round(kcalPer * servings);
  const name = `${foodEl.options[foodEl.selectedIndex].text} × ${servings}`;
  log.push({ name, kcal });
  total += kcal;
  render();
}

function removeFood(idx) {
  const item = log[idx];
  if (!item) return;
  total -= item.kcal;
  log.splice(idx, 1);
  render();
}

function clearAll() {
  total = 0;
  log.length = 0;
  render();
}

// --- Events ---
addBtn.addEventListener("click", addFood);
clearBtn.addEventListener("click", clearAll);
logEl.addEventListener("click", (e) => {
  const i = e.target.dataset.i;
  if (i !== undefined) removeFood(Number(i));
});
[maintenanceEl, weightEl, unitsEl, exerciseEl].forEach(el =>
  el.addEventListener("input", render)
);

// Initial paint
render();
