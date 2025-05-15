let seconds = 0;
let timerInterval;
$(document).ready(function(){
    // Sistema timer
$("#startGame").click(startTimer)

loadProgress();
})

function loadProgress() {
    // Se non esiste un progresso, inizializza a 1
   if (!localStorage.getItem('escapeRoomProgress')) {
        localStorage.setItem('escapeRoomProgress', 1);
    }
}

function startTimer() {
    

    // Aggiorna il timer ogni secondo
    timerInterval = setInterval(function() {
        seconds++;
        updateTimerDisplay();
    }, 1000);

    // Aggiorna il display immediatamente
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const m = minutes < 10 ? '0' + minutes : minutes;
    const s = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    $('#timeText').text(`⏱ Tempo: ${m}:${s}`);
}
