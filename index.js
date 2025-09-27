// Map each crust to your image
const BASE_IMAGE_BY_CRUST = {
  "Neapolitan": "pictures/crust.png",
  "New York":   "pictures/crust.png",
  "Thin & Crispy": "pictures/crust.png",
  "Deep Dish":  "pictures/crust.png",
  "Detroit":    "pictures/crust.png",
  "Sicilian":   "pictures/crust.png",
};

// Example messages for horoscope
const bases = {
  "Neapolitan": [
    "Simplicity wins—trim the extras and ship the thing."
  ],
  "New York": [
    "Say it plain. Direct asks get direct results."
  ],
  "Thin & Crispy": [
    "Light touch, fast iterations. Ship, learn, repeat."
  ],
  "Deep Dish": [
    "Depth over breadth. One deep dive pays compounding returns."
  ],
  "Detroit": [
    "Corners count. Polish edges: docs, titles, handoff notes."
  ],
  "Sicilian": [
    "Trust the slow rise; prep today pays tomorrow."
  ]
};

function readSelections(){
  const crust = document.querySelector('input[name="crust"]:checked').value;
  const flour = document.getElementById("flour").value;
  const toppings = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(c=>c.value);
  return { crust, flour, toppings };
}

// generate a very simple scope
function generateScope({crust, flour, toppings}){
  const base = bases[crust][0];
  return {
    headline: `${crust} • ${flour} • ${toppings.length} topping(s)`,
    blurb: base + " This week, embrace your toppings choices!"
  };
}

// Render the scope and image
function renderScope(s){
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("headline").textContent = s.headline;
  document.getElementById("blurb").textContent = s.blurb;

  const crust = document.querySelector('input[name="crust"]:checked').value;
  const baseEl = document.getElementById("img-base");
  baseEl.src = BASE_IMAGE_BY_CRUST[crust] || "pictures/crust.png";
  baseEl.classList.add("show");
}

document.getElementById("read").addEventListener("click", ()=>{
  const s = generateScope(readSelections());
  renderScope(s);
});

// Show the correct base image immediately on load
function updatePizzaPreview(){
  const crust = document.querySelector('input[name="crust"]:checked').value;
  const baseEl = document.getElementById("img-base");
  baseEl.src = BASE_IMAGE_BY_CRUST[crust] || "pictures/crust.png";
  baseEl.classList.add("show");
}
document.querySelectorAll('input[name="crust"]').forEach(r =>
  r.addEventListener('change', updatePizzaPreview)
);
updatePizzaPreview();
