const YT_KEY = "YOUR_API_KEY_HERE";
let tasks = [];

function addTask() {
    let name = document.getElementById("taskName").value;
    let deadline = document.getElementById("deadline").value;
    let priority = document.getElementById("priority").value;
    if (!name || !deadline) return alert("Enter task and deadline");
    tasks.push({ name, deadline, priority });
    showTasks();
    showToday();
}

function showTasks() {
    document.getElementById("taskList").innerHTML =
        tasks.map(t => `<li>${t.name} — (${t.deadline})</li>`).join("");
}

function showToday() {
    tasks.sort((a,b)=>b.priority-a.priority);
    document.getElementById("todayList").innerHTML =
        tasks.slice(0,3).map(t=>`<li>${t.name}</li>`).join("");
}

async function searchTopic(e) {
    if (e) e.preventDefault();
    const topic = document.getElementById("topicInput").value;
    if (!topic) return alert("Enter a topic!");

    document.getElementById("questionResults").innerHTML = `
        <li>What is ${topic}?</li>
        <li>Explain ${topic} with example.</li>
        <li>Applications of ${topic}?</li>
        <li>Advantages & disadvantages of ${topic}?</li>
        <li>Why is ${topic} important?</li>
    `;

    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${topic}&key=${YT_KEY}`
    );
    const data = await res.json();
    if (data.items) {
        document.getElementById("videoResults").innerHTML =
            data.items.map(v=>`
                <div class="video-card">
                    <img src="${v.snippet.thumbnails.medium.url}"/>
                    <p><strong>${v.snippet.title}</strong></p>
                </div>
            `).join("");
    } else {
        document.getElementById("videoResults").innerHTML = "No videos found.";
    }
}

// Timer section
let timer;
let timeLeft = 25*60;
let running=false;

function update() {
    let m=Math.floor(timeLeft/60), s=timeLeft%60;
    document.getElementById("timerDisplay").textContent =
        `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function startTimer(){
    if(running) return;
    running=true;
    timer=setInterval(()=>{
        if(timeLeft>0){ timeLeft--; update(); }
        else { clearInterval(timer); running=false; alert("Time up!"); }
    },1000);
}

function pauseTimer(){ clearInterval(timer); running=false; }

function resetTimer(){ clearInterval(timer); timeLeft=25*60; running=false; update(); }

update();
