//pomodoro
let studyActivity = 25 * 60;
let studyBreak = 5 * 60;  
let timer;
let isStudy = true; 
let isRunning = false;
let remainingTime = null;

const startTimer = () => {
    if (isRunning) return;

    const activityMinutes = parseInt(document.getElementById("studyActivityMinutes").value || 0, 10);
    const activitySeconds = parseInt(document.getElementById("studyActivitySeconds").value || 0, 10);
    const breakMinutes = parseInt(document.getElementById("studyBreakMinutes").value || 0, 10);
    const breakSeconds = parseInt(document.getElementById("studyBreakSeconds").value || 0, 10);

    if (remainingTime === null) {
        studyActivity = (activityMinutes * 60 + activitySeconds) || studyActivity;
        studyBreak = (breakMinutes * 60 + breakSeconds) || studyBreak;
    }

    let time = remainingTime || (isStudy ? studyActivity : studyBreak);
    isRunning = true;

    timer = setInterval(() => {
        if (time > 0) {
            time--;
            remainingTime = time;
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            document.querySelector("#timer h3").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        } else {
            clearInterval(timer);
            isStudy = !isStudy; 
            remainingTime = isStudy ? studyActivity : studyBreak;
            alert(isStudy ? "Waktunya Belajar!" : "Waktunya Istirahat!");
            startTimer();
        }
    }, 1000);
};

document.getElementById("start").addEventListener("click", startTimer);

document.getElementById("stop").addEventListener("click", () => {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
});

document.getElementById("reset").addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    remainingTime = null;
    isStudy = true;
    document.querySelector("#timer h3").textContent = "00:00";
});

//todolist
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("tasks");

const renderTasks = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li"); 
        li.innerHTML = `
            <span style="text-decoration: ${task.done ? "line-through" : "none"}">
                ${task.text}
            </span>
            <button onclick="toggleTask(${index})">Selesai</button>
            <button onclick="deleteTask(${index})">Hapus</button>`;
        taskList.appendChild(li);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

document.getElementById("addItem").addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.getElementById("task").value.trim();
    if (taskInput === "") return;
    tasks.push({ text: taskInput, done: false });
    document.getElementById("task").value = "";
    renderTasks();
});

const toggleTask = (index) => {
    tasks[index].done = !tasks[index].done;
    renderTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1); 
    renderTasks();
};

renderTasks();
