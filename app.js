// ====== STATE ======
const state = {
  crust: 'thin',
  sauce: 60,
  cheese: 70,
  toppings: new Set()
};

// ====== DOM (sliders/labels) ======
const sauce = document.getElementById('sauce');
const cheese = document.getElementById('cheese');
const sauceVal = document.getElementById('sauceVal');
const cheeseVal = document.getElementById('cheeseVal');

// ====== IMAGE STACK SETUP ======
// In index.html, ensure: <div class="stage"><div id="imgStack"></div></div>
const stack = document.getElementById('imgStack');
function mk(id){
  const img = document.createElement('img');
  img.id = 'img-' + id;
  img.hidden = true;                // start hidden; show when used
  img.style.position = 'absolute';
  img.style.inset = '0';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  img.draggable = false;
  stack.appendChild(img);
  return img;
}

// One <img> per layer
const layers = {
  base: mk('base'),
  sauce: mk('sauce'),
  cheese: mk('cheese'),
  pepperoni: mk('pepperoni'),
  mushroom: mk('mushroom'),
  olive: mk('olive'),
  onion: mk('onion'),
  pineapple: mk('pineapple'),
  pepper: mk('pepper'),
  bacon: mk('bacon'),
  anchovy: mk('anchovy'),
};

// ====== IMAGE SOURCES (from /pictures folder) ======
const BASE_IMAGE_BY_CRUST = {
  thin:    'pictures/crust.png',
  pan:     'pictures/crust.png',
  stuffed: 'pictures/crust.png',
  cauli:   'pictures/crust.png',
};

const TOPPING_SRC = {
  pepperoni: 'pictures/pepperoni.png',
  mushroom:  'pictures/mushroom.png',
  olive:     'pictures/olives.png',     // rename key/file if needed
  onion:     'pictures/onions.png',
  pineapple: 'pictures/pineapple.png',
  pepper:    'pictures/bellpeppers.png',
  bacon:     'pictures/bacon.png',
  anchovy:   'pictures/anchovies.png',
};

// Optional: separate overlay images for sauce/cheese shapes
const SAUCE_IMG = 'pictures/sauce.png';
const CHEESE_IMG = 'pictures/cheese.png';

// ====== HELPERS ======
function setCrust(type){
  state.crust = type;
  layers.base.src = BASE_IMAGE_BY_CRUST[type] || BASE_IMAGE_BY_CRUST.thin;
  layers.base.hidden = false;
}

function toggleTopping(key, on){
  if(on){
    state.toppings.add(key);
    layers[key].src = TOPPING_SRC[key];
  }else{
    state.toppings.delete(key);
  }
  layers[key].hidden = !on;
}

function clamp01(x){ return Math.max(0, Math.min(1, x)); }

function syncSliders(){
  sauceVal.textContent = sauce.value + '%';
  cheeseVal.textContent = cheese.value + '%';

  // Ensure sources set
  if (!layers.sauce.src)  layers.sauce.src  = SAUCE_IMG;
  if (!layers.cheese.src) layers.cheese.src = CHEESE_IMG;

  // Show and fade by slider percent
  layers.sauce.hidden = false;
  layers.cheese.hidden = false;
  layers.sauce.style.opacity  = String(clamp01(+sauce.value/100));
  layers.cheese.style.opacity = String(clamp01(+cheese.value/100));
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

  sauce.value = 60; cheese.value = 70; syncSliders();

  Object.keys(TOPPING_SRC).forEach(k=>{
    const cb = document.querySelector(`#toppingChoices input[value="${k}"]`);
    if (cb) cb.checked = false;
    toggleTopping(k, false);
  });
  state.toppings.clear();
}

function randomize(){
  const crusts = ['thin','pan','stuffed','cauli'];
  const c = crusts[Math.floor(Math.random()*crusts.length)];
  document.querySelector(`input[name="crust"][value="${c}"]`).checked = true;
  setCrust(c);

  sauce.value = Math.floor(20 + Math.random()*80);
  cheese.value = Math.floor(20 + Math.random()*80);
  syncSliders();

  Object.keys(TOPPING_SRC).forEach(k=>{
    const cb = document.querySelector(`#toppingChoices input[value="${k}"]`);
    const on = Math.random() < 0.5;
    if (cb) cb.checked = on;
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

// ====== INIT ======
setCrust('thin');
syncSliders();
