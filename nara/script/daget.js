// Realtime Clock
function updateRealtimeClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById("realtime-clock").innerText = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateRealtimeClock, 1000);
updateRealtimeClock(); // Panggil sekali saat halaman dimuat

// Fungsi Modal
let currentModalId = null;
let modalCountdownInterval;

function openModal(title, description, taskId) {
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-description").innerHTML = description;
    updateModalTime();
    document.getElementById("infoModal").style.display = "block";
    modalTimeInterval = setInterval(updateModalTime, 1000);
    currentModalId = taskId;
    updateModalCountdown();
    clearInterval(modalCountdownInterval); // Clear previous interval if any
    modalCountdownInterval = setInterval(updateModalCountdown, 1000);
}

function closeModal() {
    document.getElementById("infoModal").style.display = "none";
    clearInterval(modalTimeInterval);
    clearInterval(modalCountdownInterval);
    currentModalId = null;
}

function updateModalTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById("modal-current-time").innerText = `${hours}:${minutes}:${seconds}`;
}

function updateModalCountdown() {
    if (currentModalId !== null) {
        const now = new Date();
        const targetDateString = '2025-04-01';
        const targetTimes = [
            { hours: 9, minutes: 00, seconds: 0 },
            { hours: 12, minutes: 00, seconds: 0 },
            { hours: 15, minutes: 00, seconds: 0 },
            { hours: 17, minutes: 00, seconds: 0 }
        ];

        const targetTime = targetTimes[currentModalId - 1];

        if (targetTime) {
            const targetDate = new Date();
            targetDate.setFullYear(parseInt(targetDateString.split('-')[0]));
            targetDate.setMonth(parseInt(targetDateString.split('-')[1]) - 1);
            targetDate.setDate(parseInt(targetDateString.split('-')[2]));
            targetDate.setHours(targetTime.hours);
            targetDate.setMinutes(targetTime.minutes);
            targetDate.setSeconds(targetTime.seconds);
            targetDate.setMilliseconds(0);

            if (now < targetDate) {
                const timeLeft = targetDate.getTime() - now.getTime();
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
                const countdownElement = document.getElementById(`modal-countdown-${currentModalId}`);
                if (countdownElement) {
                    countdownElement.innerText = `${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
                }
            } else {
                const countdownElement = document.getElementById(`modal-countdown-${currentModalId}`);
                if (countdownElement) {
                    countdownElement.innerText = '0 detik [ Kamu sudah bisa KLAIM dana kaget sekarang ]';
                }
            }
        }
    }
}

window.onclick = function(event) {
    const modal = document.getElementById("infoModal");
    if (event.target == modal) {
        closeModal();
    }
}

// Ganti dengan Token API bot Telegram Anda
const telegramBotToken = '7863353249:AAGeLK7vgDRaqXrdL6dLLSmogSyySPjda7k';
// Ganti dengan Chat ID tujuan pengiriman pesan
const telegramChatId = '-4634384561';

function sendTelegramMessage(message) {
    const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const data = {
        chat_id: telegramChatId,
        text: message
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Pesan Telegram berhasil dikirim:', message);
        } else {
            console.error('Gagal mengirim pesan Telegram:', data);
        }
    })
    .catch(error => {
        console.error('Terjadi kesalahan saat mengirim pesan Telegram:', error);
    });
}

// Tanggal target untuk penguncian (YYYY-MM-DD)
const targetDateString = '2025-04-01'; // Ganti dengan tanggal yang Anda inginkan

// Waktu target untuk tombol download
const targetTimes = [
    { hours: 9, minutes: 0, seconds: 0 },
    { hours: 12, minutes: 0, seconds: 0 },
    { hours: 15, minutes: 0, seconds: 0 },
    { hours: 17, minutes: 0, seconds: 0 }
];

const downloadButtons = [
    document.getElementById('downloadButton1'),
    document.getElementById('downloadButton2'),
    document.getElementById('downloadButton3'),
    document.getElementById('downloadButton4')
];

// Daftar URL untuk setiap tombol download
const downloadURLs = [
    'https://link.dana.id/danakaget?c=s9jd3y3k9&r=cAYM8h&orderId=20250401101214887515010300166998215557185',
    'https://link.dana.id/danakaget?c=sav8wllde&r=cAYM8h&orderId=20250401101214482515010300166998215554100',
    'https://link.dana.id/danakaget?c=sfvgdejrt&r=cAYM8h&orderId=20250401101214127115010300166998215608386',
    'https://link.dana.id/danakaget?c=saqyn58ys&r=cAYM8h&orderId=20250401101214402515010300166998215494511'
];

function updateDownloadButtons() {
    const now = new Date();

    downloadButtons.forEach((button, index) => {
        const targetTime = targetTimes[index];
        const downloadURL = downloadURLs[index];
        const claimMessageTemplate = button.getAttribute('data-claim-message');
        const claimNumber = index + 1;
        const claimMessage = claimMessageTemplate.replace('{number}', claimNumber);

        const targetDate = new Date();
        targetDate.setFullYear(parseInt(targetDateString.split('-')[0]));
        targetDate.setMonth(parseInt(targetDateString.split('-')[1]) - 1);
        targetDate.setDate(parseInt(targetDateString.split('-')[2]));
        targetDate.setHours(targetTime.hours);
        targetDate.setMinutes(targetTime.minutes);
        targetDate.setSeconds(targetTime.seconds);
        targetDate.setMilliseconds(0);

        if (now >= targetDate) {
            button.innerText = 'KLAIM';
            button.classList.add('active');
            button.style.cursor = 'pointer';
            button.onclick = () => {
                if (downloadURL) {
                    sendTelegramMessage(claimMessage);
                    setTimeout(() => {
                        window.open(downloadURL, '_blank');
                    }, 500);
                    button.innerText = 'DIKLAIM';
                    button.classList.remove('active');
                    button.style.cursor = 'default';
                    button.onclick = null;
                } else {
                    alert(`URL untuk tombol ${index + 1} tidak ditemukan.`);
                }
            };
        } else {
            const timeLeft = targetDate.getTime() - now.getTime();
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
            button.innerText = `PENDING [${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}]`;
            button.classList.remove('active');
            button.style.cursor = 'not-allowed';
            button.onclick = null;
        }
    });
}

// Perbarui tombol download setiap detik
setInterval(updateDownloadButtons, 1000);

// Panggil pertama kali saat halaman dimuat
updateDownloadButtons();

