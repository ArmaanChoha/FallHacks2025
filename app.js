
// ====== STATE ======
const state = {
  crust: 'thin',
  sauce: 60,
  cheese: 70,
  toppings: new Set()
};

// ====== DOM ======
const sauce = document.getElementById('sauce');
const cheese = document.getElementById('cheese');
const sauceVal = document.getElementById('sauceVal');
const cheeseVal = document.getElementById('cheeseVal');

const groups = {
  pepperoni: document.getElementById('top-pepperoni'),
  mushroom: document.getElementById('top-mushroom'),
  olive: document.getElementById('top-olive'),
  onion: document.getElementById('top-onion'),
  pineapple: document.getElementById('top-pineapple'),
  pepper: document.getElementById('top-pepper'),
  bacon: document.getElementById('top-bacon'),
  anchovy: document.getElementById('top-anchovy'),
};

const doughOuter = document.getElementById('doughOuter');
const doughInner = document.getElementById('doughInner');
const sauceLayer = document.getElementById('sauceLayer');
const cheeseLayer = document.getElementById('cheeseLayer');

// ====== HELPERS ======
function setOpacity(el, pct){
  const v = Math.max(0, Math.min(1, pct/100));
  el.setAttribute('opacity', String(v));
}
function setCrust(type){
  state.crust = type;
  // Adjust crust ring thickness by varying inner radius
  // Outer stays 360, inner is 320 by default (40px ring)
  // Thin: inner 330 (30px ring), Pan: 315 (45px), Stuffed: 300 (60px), Cauli: 325
  const map = { thin:330, pan:315, stuffed:300, cauli:325 };
  const rInner = map[type] ?? 320;
  doughInner.setAttribute('r', rInner);
}
function toggleTopping(key, on){
  if(on) state.toppings.add(key); else state.toppings.delete(key);
  groups[key].setAttribute('visibility', on ? 'visible' : 'hidden');
}
function syncSliders(){
  sauceVal.textContent = sauce.value + '%';
  cheeseVal.textContent = cheese.value + '%';
  setOpacity(sauceLayer, +sauce.value);
  setOpacity(cheeseLayer, +cheese.value);
}
function getSelections(){
  return {
    crust: state.crust,
    sauce: state.sauce,
    cheese: state.cheese,
    toppings: Array.from(state.toppings)
  };
}
function toFortune(){
  const s = getSelections();
  // Build query to the long-form horoscope page
  const q = new URLSearchParams();
  q.set('crust', s.crust);
  q.set('sauce', s.sauce);
  q.set('cheese', s.cheese);
  s.toppings.forEach(t => q.append('t', t));
  window.location.href = 'fortune.html?' + q.toString();
}
function resetAll(){
  document.querySelector('input[name="crust"][value="thin"]').checked = true;
  setCrust('thin');
  sauce.value = 60; cheese.value = 70;
  syncSliders();
  Object.keys(groups).forEach(k=>{
    const cb = document.querySelector(`#toppingChoices input[value="${k}"]`);
    cb.checked = false;
    toggleTopping(k, false);
  });
  state.toppings.clear();
}
function randomize(){
  // Random crust
  const crusts = ['thin','pan','stuffed','cauli'];
  const c = crusts[Math.floor(Math.random()*crusts.length)];
  document.querySelector(`input[name="crust"][value="${c}"]`).checked = true;
  setCrust(c);

  // Random sliders
  sauce.value = Math.floor(20 + Math.random()*80);
  cheese.value = Math.floor(20 + Math.random()*80);
  syncSliders();

  // Random toppings selection (2-6)
  const keys = Object.keys(groups);
  keys.forEach(k=>{
    const cb = document.querySelector(`#toppingChoices input[value="${k}"]`);
    const on = Math.random() < 0.5;
    cb.checked = on;
    toggleTopping(k, on);
  });
}

// ====== WIRE EVENTS ======
document.getElementById('crustChoices').addEventListener('change', (e)=>{
  const { name, value } = e.target;
  if(name === 'crust'){ setCrust(value); }
});

sauce.addEventListener('input', ()=>{ state.sauce = +sauce.value; syncSliders(); });
cheese.addEventListener('input', ()=>{ state.cheese = +cheese.value; syncSliders(); });

document.getElementById('toppingChoices').addEventListener('change', (e)=>{
  if(e.target && e.target.type === 'checkbox'){
    toggleTopping(e.target.value, e.target.checked);
  }
});

document.getElementById('toHoroscope').addEventListener('click', toFortune);
document.getElementById('reset').addEventListener('click', resetAll);
document.getElementById('randomize').addEventListener('click', randomize);

// init
setCrust('thin'); syncSliders();
