// Navigasi tab
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section");

    function showSection(id) {
        sections.forEach(section => {
            section.style.display = section.id === id ? "block" : "none";
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            showSection(targetId);
        });
    });

    showSection("home");
});

//pomodoro
let timerInterval;
let isStudyTime = true;
let isPaused = false;
let timeRemaining;
const timerDisplay = document.querySelector("#timer h3");
const studyActivityMinutesInput = document.getElementById("studyActivityMinutes");
const studyActivitySecondsInput = document.getElementById("studyActivitySeconds");
const studyBreakMinutesInput = document.getElementById("studyBreakMinutes");
const studyBreakSecondsInput = document.getElementById("studyBreakSeconds");
const startTimerButton = document.getElementById("start");
const stopTimerButton = document.getElementById("stop");
const resetTimerButton = document.getElementById("reset");

function startTimer(duration) {
    clearInterval(timerInterval);
    timeRemaining = duration;

    timerInterval = setInterval(() => {
        if (isPaused) return;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (minutes <= 0 && seconds <= 10) {
            timerDisplay.style.color = '#AE445A';
        } else if (minutes <= 0 && 10 < seconds <= 59) {
            timerDisplay.style.color = '#F96E2A';
        } else {
            timerDisplay.style.color = "";
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert(isStudyTime ? 'Waktunya Istirahat!' : 'Waktunya belajar!');
            
            if (isStudyTime) {
                updateStudyTime(duration);
            }

            isStudyTime = !isStudyTime;
            const nextDuration = isStudyTime 
                ? (parseInt(studyActivityMinutesInput.value) * 60 + parseInt(studyActivitySecondsInput.value)) 
                : (parseInt(studyBreakMinutesInput.value) * 60 + parseInt(studyBreakSecondsInput.value));
            startTimer(nextDuration);
        }

        timeRemaining--;
    }, 1000);
}

startTimerButton.addEventListener('click', () => {
    if (!isPaused) {
        const studyDuration = (parseInt(studyActivityMinutesInput.value) * 60 + parseInt(studyActivitySecondsInput.value)) || 25 * 60;
        startTimer(studyDuration);
    } else {
        isPaused = false;
    }
});

stopTimerButton.addEventListener('click', () => {
    isPaused = true;
    clearInterval(timerInterval);
});

resetTimerButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:00';
    isPaused = false;
    isStudyTime = true;
});

//todolist
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("tasks");
const dateToday = new Date().toLocaleDateString("id-ID"); // Tanggal real-time
const taskChartCtx = document.getElementById("taskCompletionChart").getContext("2d");
let taskChart; // Variabel untuk menyimpan chart instance

// Render tugas
const renderTasks = () => {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span style="text-decoration: ${task.done ? "line-through" : "none"}">
                ${task.text} <br> (${task.date})
            </span>
            <button onclick="toggleTask(${index})">Selesai</button>
            <button onclick="deleteTask(${index})">Hapus</button>`;
        taskList.appendChild(li);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTaskChart(); // Perbarui grafik setiap kali tugas diperbarui
};

// Tambah tugas
document.getElementById("addItem").addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.getElementById("task").value.trim();
    if (taskInput === "") return;
    tasks.push({ text: taskInput, done: false, date: dateToday });
    document.getElementById("task").value = "";
    renderTasks();
});

// Tandai tugas selesai
const toggleTask = (index) => {
    tasks[index].done = !tasks[index].done;
    renderTasks();
};

// Hapus tugas
const deleteTask = (index) => {
    tasks.splice(index, 1);
    renderTasks();
};


//spotify & youtube
  document.getElementById('toggleAside').addEventListener('click', function() {
    const aside = document.getElementById('spotify');
    const toggleButton = document.getElementById('toggleAside');
    
    if (aside.style.display === 'none' || aside.style.display === '') {
        aside.style.display = 'block';
        toggleButton.innerText = 'Sembunyikan Musik';
    } else {
        aside.style.display = 'none';
        toggleButton.innerText = 'Tampilkan Musik';
    }
});

const apiKey = 'AIzaSyCFnehTsNxbs4Lj1P_I3tV9QIl4mJopo1U'; // Ganti dengan API Key Anda

// Fungsi untuk mencari video
const searchYouTube = async (query) => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching data');
        }
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('YouTube API error:', error);
        return [];
    }
};

// Fungsi untuk menampilkan hasil pencarian
const displayResults = (videos) => {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = videos.map(video => `
        <div>
            <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}" />
            <span>${video.snippet.title}</span>
            <button onclick="playVideo('${video.id.videoId}')">Play</button>
        </div>
    `).join('');
};

// Fungsi untuk memutar video
function playVideo(videoId) {
    console.log('Playing video ID:', videoId);
    const playerContainer = document.getElementById('player');
    playerContainer.innerHTML = `
        <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/${videoId}" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            allowfullscreen>
        </iframe>
    `;
}

// Event listener untuk tombol cari
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    if (!query) {
        alert('Masukkan kata kunci untuk mencari video!');
        return;
    }
    const videos = await searchYouTube(query);
    displayResults(videos);
});





// Grafik Waktu Belajar
const studyDataKey = "studyTimeData";
let studyTimeData = JSON.parse(localStorage.getItem(studyDataKey)) || {
    Senin: 0,
    Selasa: 0,
    Rabu: 0,
    Kamis: 0,
    Jumat: 0,
    Sabtu: 0,
    Minggu: 0
};

function getHariIni() {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date().getDay()];
}

function updateStudyTime(duration) {
    const hariIni = getHariIni();
    studyTimeData[hariIni] += Math.floor(duration / 60); // Tambahkan waktu belajar dalam menit
    localStorage.setItem(studyDataKey, JSON.stringify(studyTimeData)); // Simpan ke localStorage
    updateStudyTimeChart(); // Perbarui grafik
}

function updateStudyTimeChart() {
    studyTimeChart.data.datasets[0].data = Object.values(studyTimeData);
    studyTimeChart.update();
}

const studyTimeCtx = document.getElementById('studyTimeChart').getContext('2d');
const studyTimeChart = new Chart(studyTimeCtx, {
    type: 'bar',
    data: {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        datasets: [{
            label: 'Waktu Belajar (menit)',
            data: Object.values(studyTimeData),
            backgroundColor: 'rgba(92, 189, 128, 0.97)',
            borderColor: 'rgb(255, 227, 47)',
            borderWidth: 1,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgb(13, 77, 57)' // Ubah warna label legenda
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(0, 0, 255, 1)' // Ubah warna label pada sumbu X
                },
                title: {
                    display: true,
                    text: 'Hari',
                    color: 'rgba(255, 165, 0, 1)' // Ubah warna judul sumbu X
                }
            },
            y: {
                ticks: {
                    color: 'rgba(255, 0, 0, 1)' // Ubah warna label pada sumbu Y
                },
                title: {
                    display: true,
                    text: 'Waktu (menit)',
                    color: 'rgba(34, 139, 34, 1)' // Ubah warna judul sumbu Y
                }
            }
        }
    }
});

// Grafik Penyelesaian tugas
const updateTaskChart = () => {
    
    const todayTasks = tasks.filter(task => task.date === dateToday);
    const totalTasks = todayTasks.length;
    const completedTasks = todayTasks.filter(task => task.done).length;
    const addedTasks = totalTasks - completedTasks;

    // Data untuk chart
    const data = {
        labels: ["Ditambahkan", "Diselesaikan"],
        datasets: [{
            data: [addedTasks, completedTasks],
            backgroundColor: ["#F9D923", "#70AE6E"],
        }]
    };

    // Buat atau perbarui chart
    if (taskChart) {
        taskChart.data = data;
        taskChart.update();
    } else {
        taskChart = new Chart(taskChartCtx, {
            type: "pie",
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    }
                }
            }
        });
    }
};

// Render awal
renderTasks();

