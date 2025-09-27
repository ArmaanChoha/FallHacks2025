// --- Tiny deterministic RNG so results stay the same for the week ---
function xmur3(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return (h^h>>>16)>>>0}}
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}

// --- Data banks ---
const bases = {
  "Neapolitan": [
    "Simplicity wins—trim the extras and ship the thing.",
    "Center yourself; small, perfect moves beat big messy ones.",
    "Let tradition guide you, but sign your own flourish."
  ],
  "New York": [
    "Go long and focused; one bold slice of effort carries the day.",
    "Say it plain. Direct asks get direct results.",
    "Keep moving—momentum is your seasoning."
  ],
  "Thin & Crispy": [
    "Light touch, fast iterations. Ship, learn, repeat.",
    "Less weight = more lift. Declutter one commitment.",
    "Speed matters—don’t overthink the crust."
  ],
  "Deep Dish": [
    "Depth over breadth. One deep dive pays compounding returns.",
    "Protect your time; build walls around your focus window.",
    "Layer carefully—foundations first, toppings later."
  ],
  "Detroit": [
    "Corners count. Polish edges: docs, titles, handoff notes.",
    "Let constraints spark creativity; work with the pan you’ve got.",
    "Caramelize your wins—showcase the crusty bits."
  ],
  "Sicilian": [
    "Be sturdy and generous—help one person thoroughly.",
    "Batch work in trays; context switching is the real cost.",
    "Trust the slow rise; prep today pays tomorrow."
  ]
};

const flourTone = {
  "00": ["Refine the basics.", "Prioritize quality over quantity."],
  "Whole Wheat": ["Choose the wholesome option once a day.", "Sustainability beats sprinting."],
  "Gluten-Free": ["Reroute around blockers; there’s always a path.", "Define your own rules."],
  "Sourdough": ["Patience creates flavor—sleep on a decision.", "Nurture routines that feed you back."],
  "Cauliflower": ["Surprise them with a lighter take.", "Challenge an assumption politely."],
  "Semolina": ["Add resilience—buffer your schedule.", "Anchor your plan with one non-negotiable."]
};

const toppingMods = {
  "Pepperoni": ["lead with confidence", "negotiate first"],
  "Mushrooms": ["research quietly", "journal for 5 minutes"],
  "Pineapple": ["assume good intent", "share a gratitude note"],
  "Jalapeños": ["take the bold option", "ship v1 today"],
  "Olives": ["seek a second opinion", "balance the room"],
  "Onions": ["ask one clarifying question", "peel back assumptions"],
  "Chicken": ["fuel with protein first", "do the practical step"],
  "Bacon": ["treat yourself—small reward", "cut the fluff"],
  "Basil": ["make it elegant", "tidy your workspace"],
  "Extra Cheese": ["over-communicate once", "add comfort to the plan"],
  "Anchovies": ["tell the uncomfortable truth", "measure what matters"],
  "Bell Peppers": ["add color—show, don’t tell", "present a quick mock"]
};

const powerMoves = [
  "Send the DM that unblocks you.",
  "Schedule a 20-minute solo sprint.",
  "Write a 3-bullet brief, then execute.",
  "Decline one low-impact thing.",
  "Ship the rough draft before lunch.",
  "Ask for feedback from one skeptic."
];

const bestDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const slices = ["Margherita","Diavola","Quattro Formaggi","BBQ Chicken","Veggie Supreme","Hawaiian","White Pie","Truffle Special"];

// --- Helpers ---
function getISOWeek(date=new Date()){
  const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  const dayNum=d.getUTCDay()||7; d.setUTCDate(d.getUTCDate()+4-dayNum);
  const yearStart=new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const week=Math.ceil((((d-yearStart)/86400000)+1)/7);
  return `${d.getUTCFullYear()}-W${week}`;
}

function pick(rand, arr){ return arr[Math.floor(rand()*arr.length)] }

function readSelections(){
  const crust = document.querySelector('input[name="crust"]:checked').value;
  const flour = document.getElementById("flour").value;
  const toppings = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(c=>c.value);
  return { crust, flour, toppings };
}

function generateScope({crust, flour, toppings}){
  // Seed by week + selections so it’s stable for the week
  const seedStr = getISOWeek() + "|" + crust + "|" + flour + "|" + toppings.sort().join(",");
  const rand = mulberry32(xmur3(seedStr)());

  const base = pick(rand, bases[crust]);
  const tone = pick(rand, flourTone[flour]);
  const modList = toppings.length ? toppings : ["(no toppings)"];
  const mods = modList.slice(0,3).map(t => pick(rand, toppingMods[t] || ["keep it simple"]));

  const headline = `${crust} • ${flour} • ${toppings.length || 0} topping${toppings.length===1?"":"s"}`;
  const blurb = [
    base,
    tone,
    `This week, ${mods.join("; ")}.`
  ].join(" ");

  const luckySlice = pick(rand, slices);
  const power = pick(rand, powerMoves);
  const luckyNumber = Math.floor(rand()*77)+1;
  const bestDay = pick(rand, bestDays);

  return {headline, blurb, luckySlice, power, luckyNumber, bestDay};
}

function renderScope(s){
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("headline").textContent = s.headline;
  document.getElementById("blurb").textContent = s.blurb;
  document.getElementById("luckySlice").textContent = s.luckySlice;
  document.getElementById("powerMove").textContent = s.power;
  document.getElementById("luckyNumber").textContent = s.luckyNumber;
  document.getElementById("bestDay").textContent = s.bestDay;
}

function copyResult(){
  const h = document.getElementById("headline").textContent;
  const b = document.getElementById("blurb").textContent;
  const ls = document.getElementById("luckySlice").textContent;
  const pm = document.getElementById("powerMove").textContent;
  const ln = document.getElementById("luckyNumber").textContent;
  const bd = document.getElementById("bestDay").textContent;

  const text = `🍕 PizzaScope\n${h}\n\n${b}\n\nLucky Slice: ${ls}\nPower Move: ${pm}\nLucky Number: ${ln}\nBest Day: ${bd}`;
  navigator.clipboard.writeText(text).then(()=>{
    const btn = document.getElementById("copy");
    const old = btn.textContent;
    btn.textContent = "✅ Copied!";
    setTimeout(()=>btn.textContent = old, 1200);
  });
}

// --- Events ---
document.getElementById("read").addEventListener("click", ()=>{
  const s = generateScope(readSelections());
  renderScope(s);
});
document.getElementById("copy").addEventListener("click", copyResult);
