
// ========= UTIL: Seeded RNG so same pizza --> same reading =========
function hashString(str){
  let h = 2166136261 >>> 0;
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function RNG(seed){
  let x = seed >>> 0;
  return function(){
    // Xorshift* algorithm
    x ^= x << 13; x >>>= 0;
    x ^= x >> 17; x >>>= 0;
    x ^= x << 5;  x >>>= 0;
    return (x >>> 0) / 0xFFFFFFFF;
  };
}
function pick(r, arr){ return arr[Math.floor(r()*arr.length)] }
function sampleN(r, arr, n){
  const pool = arr.slice();
  const out = [];
  while(out.length<n && pool.length){
    const idx = Math.floor(r()*pool.length);
    out.push(pool.splice(idx,1)[0]);
  }
  return out;
}

// ========= Read Query =========
const q = new URLSearchParams(location.search);
const crust = q.get('crust') || 'thin';
const sauce = +(q.get('sauce') || 60);
const cheese = +(q.get('cheese') || 70);
const toppings = q.getAll('t') || [];

const seedStr = JSON.stringify({crust,sauce,cheese,toppings:toppings.slice().sort()});
const rnd = RNG(hashString(seedStr));

// ========= Summaries =========
const crustArchetype = {
  thin: "Air Sign of Crispy Resolve",
  pan: "Earth Sign of Comfort & Gravity",
  stuffed: "Fire Sign of Hidden Indulgence",
  cauli: "Water Sign of Reinvention"
};
const crustRing = { thin:330, pan:315, stuffed:300, cauli:325 };

const toppingTraits = {
  pepperoni: ["bold impulses","spicy comebacks","red-flag awareness (the good kind)"],
  mushroom:  ["quiet intuition","side-quest energy","forest brain"],
  olive:     ["salty wit","mysterious DMs","Mediterranean plotting"],
  onion:     ["honest tears","layered patience","well-timed clapbacks"],
  pineapple: ["chaotic good aura","vacation brain","rule-breaking charm"],
  pepper:    ["color-pop courage","vitamin confidence","group-project leadership"],
  bacon:     ["main-character energy","forbidden luxury","side-quest gluttony"],
  anchovy:   ["underground taste","unbothered aura","mariner mindset"]
};

// Sauce/Cheese elemental vibes
function elementBlend(saucePct, cheesePct){
  // Map sauce to heat, cheese to comfort
  const heat = saucePct/100, comfort = cheesePct/100;
  const lanes = [
    {k:"Comet Heat", d:"you spark first, think later"},
    {k:"River Calm", d:"you time the tide perfectly"},
    {k:"Sun Hearth", d:"you warm rooms without trying"},
    {k:"Moon Chill", d:"you keep cool, even in chaos"},
  ];
  const tag = heat>0.66 ? "Comet Heat" : heat<0.33 ? "Moon Chill" : (comfort>0.66 ? "Sun Hearth" : "River Calm");
  const desc = lanes.find(x=>x.k===tag).d;
  return {tag,desc};
}

// Lucky lists
const omens = ["a free upgrade","the last slice","a strangely specific coupon","front-row seating","perfect parking","green lights only","a suspiciously kind email","exact change in your pocket"];
const numbers = [3,7,11,14,18,21,24,27,33,42,69,77,88];
const colors = ["Nebula Cheese","Pepperoni Red","Oven Ember","Midnight Marinara","Basil Neon","Galactic Dough","Pink Garlic","Deep Dish Gold"];

// ========= Render Summary Pills & Mini Pizza =========
function renderSummary(){
  const pillbox = document.getElementById('pillbox');
  pillbox.innerHTML = "";
  const pills = [
    `Crust: <strong>${crust}</strong>`,
    `Sauce: <strong>${sauce}%</strong>`,
    `Cheese: <strong>${cheese}%</strong>`,
  ].concat(toppings.map(t=>`Topping: <strong>${t}</strong>`));
  pills.forEach(html=>{
    const el = document.createElement('span'); el.className='pill'; el.innerHTML = html; pillbox.appendChild(el);
  });

  // adjust ring & layers
  document.getElementById('doughInner').setAttribute('r', crustRing[crust] ?? 320);
  document.getElementById('sauceLayer').setAttribute('opacity', String(Math.max(0,Math.min(1, sauce/100))*0.75));
  document.getElementById('cheeseLayer').setAttribute('opacity', String(Math.max(0,Math.min(1, cheese/100))*0.9));

  // pepperoni hint only if pepperoni was chosen
  document.getElementById('mini-peps').setAttribute('opacity', toppings.includes('pepperoni')? "1" : "0.18");
}

// ========= Compose Sections =========
function paragraph(...parts){ return parts.filter(Boolean).join(" ") }

function buildIntro(){
  const arch = crustArchetype[crust] || "Wandering Sign of Improvisation";
  const el = elementBlend(sauce,cheese);
  const tTraits = toppings.length ? sampleN(rnd, toppings, Math.min(3,toppings.length)).map(t=>pick(rnd,toppingTraits[t]||["unexpected taste"])).join(", ") : "uncomplicated cravings";
  const line = paragraph(
    `Under the ${arch}, your slice charts a course through ${el.tag.toLowerCase()}.`,
    `Tonight, ${el.desc}; tomorrow, destiny asks for seconds.`,
    `Your toppings whisper: <span class="highlight">${tTraits}</span>.`
  );
  return {title:"The Oven Opens", icon:"🔥", body: line, tag:"Prelude"};
}

function buildLove(){
  const verbs = ["text first","double-tap","ghost gently","say yes to coffee","steal a fry","share the last slice","walk away smiling"];
  const advice = ["leave room for dessert","set a timer before overthinking","trust the warm read","ignore the cold take","let playlists do the flirting"];
  const v = pick(rnd,verbs); const a = pick(rnd,advice);
  const line = paragraph(
    `Romance rises like dough.`,
    `If they mention your favorite topping, ${v}.`,
    `If they judge your crust, ${pick(rnd,["laugh it off","be unbothered","offer them ranch"])}, then ${a}.`
  );
  return {title:"Matters of the Heart", icon:"💘", body: line, tag:"Love"};
}

function buildAmbition(){
  const rewards = ["a quiet win","a public dub","unexpected praise","a perfect merge","a clean PR","a smooth deploy","standing ovation in a tiny room"];
  const blockers = ["calendar chaos","tab overload","Wi-Fi gremlins","scope creep","phantom notifications","keyboard crumbs"];
  const r = pick(rnd,rewards), b = pick(rnd,blockers);
  const line = paragraph(
    `Ambition preheats.`,
    `Expect ${r} after you clear ${b}.`,
    `Choose speed or craft, but not both before lunch.`,
    `A meeting moved itself for you — take the hint.`
  );
  return {title:"Ambition & Loot", icon:"💼", body: line, tag:"Career"};
}

function buildChaos(){
  const weird = [
    "a stranger compliments your beverage temperature",
    "you catch a falling item with impossible reflex",
    "a sign misspells your name but it works",
    "a playlist predicts your mood three songs in",
    "a bird nods like it knows",
    "the elevator arrives already empty and facing you"
  ];
  const omen = pick(rnd, omens);
  const line = paragraph(
    `Chaos Energy is playful today.`,
    `Watch for ${pick(rnd,weird)}.`,
    `When it happens, claim your reward: ${omen}.`
  );
  return {title:"Chaos Energy Report", icon:"🌀", body: line, tag:"Entropy"};
}

function buildWellness(){
  const hyd = ["sip water dramatically","add a lemon slice like a main character","respect the nap window","stretch like you mean it","walk the long way, once"];
  const tip = toppings.includes("anchovy") ? "salt seeks balance; hydrate twice." :
              toppings.includes("pineapple") ? "sweet seeks ground; breathe low and slow." :
              toppings.includes("bacon") ? "rich seeks rest; pick a gentler pace tonight." :
              pick(rnd, hyd);
  const line = paragraph(
    `Your body hears every choice.`,
    `Today, ${tip}.`,
    `Tomorrow, your future self leaves a thank-you note on the fridge.`
  );
  return {title:"Wellness & Recovery", icon:"🫧", body: line, tag:"Care"};
}

function buildLucky(){
  const nums = sampleN(rnd, numbers, 5).join(" • ");
  const col = pick(rnd, colors);
  const hour = ["08:08","11:11","12:34","15:15","21:21","22:22"][Math.floor(rnd()*6)];
  const line = paragraph(
    `Lucky Numbers: <span class="highlight">${nums}</span>.`,
    `Lucky Color: <span class="highlight">${col}</span>.`,
    `Alignment Hour: <span class="highlight">${hour}</span>.`,
    `Cabinet Oracle says: there is exactly one snack you forgot you owned.`
  );
  return {title:"Omens & Numbers", icon:"✨", body: line, tag:"Augury"};
}

const sections = [buildIntro, buildLove, buildAmbition, buildChaos, buildWellness, buildLucky];

function renderSections(){
  const root = document.getElementById('readingRoot');
  root.innerHTML = "";
  sections.forEach(builder=>{
    const {title, icon, body, tag} = builder();
    const sec = document.createElement('section');
    sec.className = 'section';
    sec.innerHTML = `
      <div class="head">
        <div class="glyph">${icon}</div>
        <h3>${title}</h3>
        <div class="tag">${tag}</div>
      </div>
      <div class="body">
        <p>${body}</p>
        <div class="sep"></div>
        <p>${pick(rnd,[
          "If in doubt, reheat gently — second chances are tastier.",
          "A text you send at the right minute changes the week.",
          "Your patience is a superpower; deploy it like hot honey.",
          "Tiny rituals make huge days.",
          "Say the compliment out loud."
        ])}</p>
      </div>
    `;
    root.appendChild(sec);
  });
}

// ========= Share  =========
document.getElementById('shareCard').addEventListener('click', ()=>{
  window.print();
});

renderSummary();
renderSections();
