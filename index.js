// === Maps ===
const BASE_IMAGE_BY_CRUST = {
  "Neapolitan": "pictures/crust.png",
  "New York":   "pictures/crust.png",
  "Thin & Crispy": "pictures/crust.png",
  "Deep Dish":  "pictures/crust.png",
  "Detroit":    "pictures/crust.png",
  "Sicilian":   "pictures/crust.png",
};

const TOPPING_IMAGE = {
  "Pepperoni":     "pictures/pepperoni.png",
  "Mushrooms":     "pictures/mushroom.png",
  "Pineapple":     "pictures/pineapple.png",
  "Olives":        "pictures/Olives.png",       // case-sensitive
  "Onions":        "pictures/onions.png",
  "Jalapeños":     "pictures/jalepenos.png",    // file has no ñ — OK
  "Chicken":       "pictures/chicken.png",
  "Bacon":         "pictures/bacon.png",
  "Basil":         "pictures/basil.png",
  "Extra Cheese":  "pictures/cheese.png",
  "Anchovies":     "pictures/anchovies.png",
  "Bell Peppers":  "pictures/bellpeppers.png"   // rename file or use "bell%20peppers.png"
};

// === Horoscope stub (unchanged) ===
const bases = {
  "Neapolitan": ["Simplicity wins—trim the extras and ship the thing."],
  "New York": ["Say it plain. Direct asks get direct results."],
  "Thin & Crispy": ["Light touch, fast iterations. Ship, learn, repeat."],
  "Deep Dish": ["Depth over breadth. One deep dive pays compounding returns."],
  "Detroit": ["Corners count. Polish edges: docs, titles, handoff notes."],
  "Sicilian": ["Trust the slow rise; prep today pays tomorrow."]
};

function readSelections(){
  const crust = document.querySelector('input[name="crust"]:checked').value;
  const flour = document.getElementById("flour").value;
  const toppings = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(c=>c.value);
  return { crust, flour, toppings };
}

function generateScope({crust, flour, toppings}){
  const base = bases[crust][0];
  return {
    headline: `${crust} • ${flour} • ${toppings.length} topping(s)`,
    blurb: base + " This week, embrace your toppings choices!"
  };
}

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

function updatePizzaPreview(){
  const crust = document.querySelector('input[name="crust"]:checked').value;
  const baseEl = document.getElementById("img-base");
  baseEl.src = BASE_IMAGE_BY_CRUST[crust] || "pictures/crust.png";
  baseEl.classList.add("show");
}

function syncToppingsFromState(){
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    const img = document.querySelector(`img[data-top="${cb.value}"]`);
    if (!img) return;
    if (cb.checked) {
      if (!TOPPING_IMAGE[cb.value]) {
        console.warn("No image path for topping:", cb.value);
        img.classList.remove('show');
        return;
      }
      img.src = TOPPING_IMAGE[cb.value];
      img.classList.add('show');
    } else {
      img.classList.remove('show');
    }
  });
}

// === Wire up events (do this LAST) ===
document.querySelectorAll('input[name="crust"]').forEach(r =>
  r.addEventListener('change', updatePizzaPreview)
);
document.querySelectorAll('input[type="checkbox"]').forEach(cb =>
  cb.addEventListener('change', syncToppingsFromState)
);

// initial render
updatePizzaPreview();
syncToppingsFromState();
