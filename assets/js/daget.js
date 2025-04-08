document.addEventListener('DOMContentLoaded', function() {
    const answerInputs = {
        1: document.getElementById('answer1'),
        2: document.getElementById('answer2'),
        3: document.getElementById('answer3'),
        4: document.getElementById('answer4'),
        5: document.getElementById('answer5'),
        6: document.getElementById('answer6'),
        7: document.getElementById('answer7'),
        8: document.getElementById('answer8'),
        9: document.getElementById('answer9'),
        10: document.getElementById('answer10')
    };
    const answerButtons = {};
    for (let i = 1; i <= 10; i++) {
        answerButtons[i] = document.querySelector(`.answer-button[data-question="${i}"]`);
    }
    const messageElement = document.getElementById('message');
    const wrongAnswerOverlay = document.getElementById('wrong-answer-overlay');
    const wrongAnswerImage = document.getElementById('wrong-answer-image');
    const wrongAnswerTextElement = document.getElementById('wrong-answer-text');
    let correctAnswers = {};
    let redirectUrls = {};
    const successOverlay = document.getElementById('success-overlay');
    const successVideo = document.getElementById('success-video');
    const loadingBar = document.getElementById('loading-bar');
    const countdownText = document.getElementById('countdown-text');
    const totalLoadingTime = 20000; // Durasi loading lebih singkat untuk setiap soal
    const loadingIntervalTime = 100;
    let elapsedTime = 0;
    let countdownInterval;
    const unlockTimes = {};
    for (let i = 2; i <= 10; i++) {
        unlockTimes[i] = new Date();
        unlockTimes[i].setHours(24 + (i - 2), 0, 0, 0); // Soal 2 mulai jam 8, soal 3 jam 9, dst.
    }

    successVideo.controls = false;

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateCountdown(questionNumber) {
        const now = new Date();
        const jakartaTimezoneOffset = now.getTimezoneOffset() * 60000 + (7 * 3600000); // WIB offset
        const nowWIB = new Date(now.getTime() + jakartaTimezoneOffset);
        const unlockTime = new Date(unlockTimes[questionNumber]);

        if (nowWIB < unlockTime) {
            const diff = unlockTime.getTime() - nowWIB.getTime();
            const totalSeconds = Math.ceil(diff / 1000);
            answerButtons[questionNumber].textContent = `Terkunci (${formatTime(totalSeconds)})`;
            answerButtons[questionNumber].disabled = true;
            answerButtons[questionNumber].classList.add('locked');
        } else {
            answerButtons[questionNumber].textContent = 'Jawab';
            answerButtons[questionNumber].disabled = false;
            answerButtons[questionNumber].classList.remove('locked');
        }
    }

    function showWrongAnswer() {
        wrongAnswerOverlay.classList.add('show');
        wrongAnswerImage.style.opacity = 1; // Langsung munculkan gambar

        setTimeout(() => {
            wrongAnswerOverlay.classList.remove('show');
            wrongAnswerImage.style.opacity = 0; // Fade out gambar
        }, 2000);
    }

    function checkUnlockTimes() {
        const now = new Date();
        const jakartaTimezoneOffset = now.getTimezoneOffset() * 60000 + (7 * 3600000); // WIB offset
        const nowWIB = new Date(now.getTime() + jakartaTimezoneOffset);
        const currentHour = nowWIB.getHours();

        // Soal 1 selalu terbuka
        answerButtons[1].textContent = 'Jawab';
        answerButtons[1].disabled = false;
        answerButtons[1].classList.remove('locked');

        for (let i = 2; i <= 10; i++) {
            updateCountdown(i);
        }
    }

    // Perbarui hitungan mundur setiap detik
    setInterval(checkUnlockTimes, 1000);
    checkUnlockTimes(); // Pengecekan awal saat halaman dimuat

    function startSuccessSequence(redirectUrl) {
        return new Promise((resolve) => {
            successOverlay.style.display = 'flex';
            successVideo.muted = false;
            successVideo.play();
            successText.textContent = 'SELAMAT! JAWABAN BENAR...'; // Pesan selamat singkat

            let width = 0;
            elapsedTime = 0; // Reset waktu
            const loadingInterval = setInterval(function() {
                elapsedTime += loadingIntervalTime;
                width = (elapsedTime / totalLoadingTime) * 100;
                loadingBar.style.width = width + '%';

                const remainingTime = Math.ceil((totalLoadingTime - elapsedTime) / 1000);
                countdownText.textContent = `Memuat... (${remainingTime})`;

                if (elapsedTime >= totalLoadingTime) {
                    clearInterval(loadingInterval);
                    successOverlay.style.display = 'none'; // Sembunyikan overlay setelah selesai
                    resolve();
                }
            }, loadingIntervalTime);
        });
    }

    const successText = document.getElementById('success-text');

    // Ambil data jawaban dari answers.json
    fetch('/assets/nara/answers.json')
        .then(response => response.json())
        .then(data => {
            correctAnswers = data;
        })
        .catch(error => console.error('Gagal mengambil data jawaban:', error));

    // Ambil data link dari links.json
    fetch('/assets/nara/links.json')
        .then(response => response.json())
        .then(data => {
            redirectUrls = data;
        })
        .catch(error => console.error('Gagal mengambil data link:', error));

    for (let i = 1; i <= 10; i++) {
        answerButtons[i].addEventListener('click', async function() {
            const button = this;
            const questionNumber = parseInt(button.dataset.question);
            const userAnswer = answerInputs[questionNumber].value.toLowerCase().replace(/\s/g, '');

            if (!correctAnswers[questionNumber] || !redirectUrls[questionNumber]) {
                console.error(`Data jawaban atau link untuk soal ${questionNumber} tidak ditemukan.`);
                return;
            }

            const correctAnswer = correctAnswers[questionNumber];
            const redirectUrl = redirectUrls[questionNumber];

            button.disabled = true; // Nonaktifkan tombol setelah diklik

            if (userAnswer === correctAnswer) {
                messageElement.textContent = `Jawaban Soal ${questionNumber} Benar! Mengarahkan...`;
                messageElement.className = "success";
                messageElement.classList.remove("hidden");
                answerInputs[questionNumber].disabled = true;

                await startSuccessSequence(redirectUrl);
                window.location.href = redirectUrl;
            } else {
                showWrongAnswer();
                messageElement.textContent = `Jawaban Soal ${questionNumber} Salah. Coba lagi.`;
                messageElement.className = "error";
                messageElement.classList.remove("hidden");
                setTimeout(() => {
                    messageElement.classList.add("hidden");
                    button.disabled = false; // Aktifkan kembali tombol setelah pesan salah hilang
                }, 2000);
            }
        });
    }
});
