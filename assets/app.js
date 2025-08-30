function pad(n){return (n<10?'0':'')+n}
function timeToMinutes(t){const [h,m]=t.split(':').map(Number);return h*60+m}
function minutesToTime(mins){mins=(mins+1440)%1440;const h=Math.floor(mins/60)%24;const m=mins%60;return pad(h)+':'+pad(m)}

function generateSchedule(){
  const meals = Math.max(1, Math.min(12, parseInt(document.getElementById('meals').value || 4)));
  const start = timeToMinutes(document.getElementById('start').value || "07:00");
  const end   = timeToMinutes(document.getElementById('end').value || "21:00");
  const days  = Math.max(1, Math.min(7, parseInt(document.getElementById('days').value || 3)));
  const portion = parseFloat(document.getElementById('portion').value || 0);
  const feeders = parseInt(document.getElementById('feeders').value || 0);
  const slots   = parseInt(document.getElementById('slots').value || 0);

  const span = (end>=start)? (end - start) : (1440 - (start - end));
  const step = meals>1 ? Math.floor(span/(meals-1)) : 0;

  let out = [];
  for(let d=0; d<days; d++){
    out.push(`Day ${d+1}`);
    for(let i=0;i<meals;i++){
      const t = minutesToTime(start + i*step);
      let line = `  • ${t}`;
      if(!isNaN(portion) && portion>0) line += ` — ${portion} scoops`;
      if(feeders>0 && slots>0){
        const totalSlots = feeders*slots;
        const mealIndex = d*meals + i;
        const slotIndex = mealIndex % totalSlots;
        const feederNum = (Math.floor(slotIndex/slots)+1);
        const slotNum = (slotIndex % slots) + 1;
        line += `  (Feeder ${feederNum}, Slot ${slotNum})`;
      }
      out.push(line);
    }
    out.push('');
  }
  document.getElementById('results').textContent = out.join('\n');
}

document.getElementById('go').addEventListener('click', generateSchedule);
document.getElementById('copy').addEventListener('click', ()=>{
  const txt = document.getElementById('results').textContent;
  navigator.clipboard.writeText(txt);
  alert('Schedule copied!');
});
window.addEventListener('load', generateSchedule);
