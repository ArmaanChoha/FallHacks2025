(function(){
    const $ = id => document.getElementById(id);
    const foodEl = $("food"), exEl = $("exercise"), wEl = $("weight"), unitsEl = $("units");
    const minutesEl = $("minutes"), quipEl = $("quip");
    const kcalChip = $("kcalChip"), metChip = $("metChip"), burnChip = $("burnChip");
  
    function toKg(value, units){ return units === "lb" ? value * 0.45359237 : value; }
  
    function calc(){
      const kcal = parseFloat(foodEl.value);
      const MET = parseFloat(exEl.value);
      const w = parseFloat(wEl.value);
      const units = unitsEl.value;
  
      if(!kcal || !MET || !w || w <= 0){
        minutesEl.textContent = "Fill all fields to get your minutes";
        quipEl.textContent = "Tip: choose a food, an exercise, and enter weight > 0.";
        kcalChip.textContent = `Food: ${isNaN(kcal)? "—" : kcal} kcal`;
        metChip.textContent  = `Exercise: ${isNaN(MET)? "—" : MET} MET`;
        burnChip.textContent = "Burn rate: — kcal/min";
        return;
      }
  
      const kg = toKg(w, units);
      const burnPerMin = (MET * 3.5 * kg) / 200; // kcal/min
      const mins = Math.ceil(kcal / burnPerMin);
  
      const exName = exEl.options[exEl.selectedIndex].text.split(" — ")[0].toLowerCase();
      minutesEl.textContent = `You'll need about ${mins} minute${mins===1?"":"s"} of ${exName}.`;
  
      let msg = "Nice! Solid plan.";
      if (mins <= 10) msg = "Blink and it's done 💨";
      else if (mins <= 30) msg = "You got this! 🎯";
      else if (mins <= 60) msg = "Podcast time? 🎧";
      else if (mins <= 120) msg = "Maybe split into two sessions 😊";
      else msg = "Bold move. Or… share that pizza with a friend 😅";
      quipEl.textContent = msg;
  
      kcalChip.textContent = `Food: ${kcal} kcal`;
      metChip.textContent  = `Exercise: ${MET} MET`;
      burnChip.textContent = `Burn rate: ${burnPerMin.toFixed(1)} kcal/min`;
    }
  
    document.getElementById("calc").addEventListener("click", calc);
    console.log("index.js loaded ✅");
  })();
  