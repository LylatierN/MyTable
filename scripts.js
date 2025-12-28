
// Change this line
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];const grid = document.getElementById('timetable-grid');
let myClasses = JSON.parse(localStorage.getItem('savedClasses')) || [];


function initTable(){
    grid.innerHTML = '';
    // 1. Top Left Corner
        const corner = document.createElement('div');
        corner.className = "text-start py-2 bg-slate-800 text-white text-[10px] font-bold border-r border-b border-slate-700";
        corner.innerText = "Date/Time";
        grid.appendChild(corner);

        // 2. Time Labels (8:00 - 20:00)
        for (let i = 0; i < 13; i++) {
            const label = document.createElement('div');
            label.className = "col-span-2 text-start py-2 bg-slate-800 text-white text-[10px] font-bold border-r border-b border-slate-700";
            label.innerText = (8 + i) + ":00";
            grid.appendChild(label);
        }

        // 3. Days & Slots
        DAYS.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.className = `text-black font-black flex items-center justify-center border-r border-b border-slate-300 dark:border-slate-700 text-[10px] ${day.toLowerCase()}`;
            dayLabel.innerText = day;
            grid.appendChild(dayLabel);

            for (let s = 0; s < 26; s++) {
                const slot = document.createElement('div');
                slot.className = "slot bg-white dark:bg-slate-800 border-b border-x-0 border-slate-700";
                if (s === 25){
                    slot.className += ' border-r'
                }
                slot.id = `${day}-slot-${s}`;
                grid.appendChild(slot);
            }
        });
}


function timeToSlot(timeStr){
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours - 8) * 2 + (minutes >= 30 ? 1 : 0);
}

function processInput(){
    const name = document.getElementById("className").value;
    const place = document.getElementById("classPlace").value;
    const day = document.getElementById("daySelect").value;

    const startStr = document.getElementById("startTime").value;
    const endStr = document.getElementById("endTime").value;

    const startSlot = timeToSlot(startStr);
    const endSlot = timeToSlot(endStr);
    const duration = endSlot - startSlot;

    if (duration <= 0 || !name) {
        alert("Check input!");
        return;
    }

    myClasses.push({ id: Date.now(), name, day, place, startSlot, duration, startStr, endStr});
    saveAndRefresh();
}

function saveAndRefresh(){
    localStorage.setItem('savedClasses', JSON.stringify(myClasses));
    RenderAll()
}



function RenderAll(){
    initTable();
    const list = document.getElementById('classes-list');
    list.innerHTML = ''; // reset the list

    myClasses.forEach(c => {

        const startCell = document.getElementById(`${c.day}-slot-${c.startSlot}`);
                if (startCell) {
                    startCell.innerHTML = `<div class="text-black text-xs px-1 text-start whitespace-nowrap">
                                            <p class="font-normal">[${c.startStr}] - [${c.endStr}]</p>
                                            <p>${c.name}</p>
                                            <p class="text-slate-900/50 font-normal">${c.place}</p>
                                            </div>`;
                    startCell.className = `slot text-white p-1 text-[10px] font-bold flex items-start justify-start shadow-inner border border-slate-800 rounded-md ${c.day.toLowerCase()}`;
                    startCell.style.gridColumn = `span ${c.duration}`;
                    for (let i = 1; i < c.duration; i++) {
                        const extra = document.getElementById(`${c.day}-slot-${c.startSlot + i}`);
                        if (extra) extra.remove();
                    }
                }

        const item =document.createElement("div");
        item.className = `flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border dark:border-slate-600 ${c.day.toLowerCase()}`;
        item.innerHTML = `<div class="text-xs font-bold truncate mr-2">
                            ${c.name}</div>
                          <button onclick="deleteClass(${c.id})" class="text-red-500 text-[10px] font-black uppercase">Del</button>`;
        list.appendChild(item);
    })
}

function deleteClass(id) {
            myClasses = myClasses.filter(c => c.id !== id);
            saveAndRefresh();}

function exportImage(){
    const area = document.getElementById('capture-area');
            html2canvas(area, { scale: 3, backgroundColor: null }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'Timetable.png';
                link.href = canvas.toDataURL();
                link.click();
            });
}



saveAndRefresh();



