document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    const messageElement = document.getElementById('message');
    const correctPassword = "70butir";
    const targetUrl = "https://link.dana.id/danakaget?c=sepd3r6sy&r=cAYM8h&orderId=20250404101214004515010300166998216236520";
    const successOverlay = document.getElementById('success-overlay');
    const successVideo = document.getElementById('success-video');
    const loadingBar = document.getElementById('loading-bar');
    const countdownText = document.getElementById('countdown-text');
    const totalLoadingTime = 22000;
    const loadingIntervalTime = 100;
    let elapsedTime = 0;
    let countdownInterval;

    successVideo.controls = false;

    submitBtn.addEventListener('click', function() {
        const enteredPassword = passwordInput.value;

        if (enteredPassword === correctPassword) {
            messageElement.textContent = "Kata sandi benar. Mengarahkan ke daget...";
            messageElement.className = "success";
            messageElement.classList.remove("hidden");

            successOverlay.style.display = 'flex';
            successVideo.muted = false;
            successVideo.play();

            let width = 0;
            const loadingInterval = setInterval(function() {
                elapsedTime += loadingIntervalTime;
                width = (elapsedTime / totalLoadingTime) * 100;
                loadingBar.style.width = width + '%';

                const remainingTime = Math.ceil((totalLoadingTime - elapsedTime) / 1000);
                countdownText.textContent = `Iklan... (${remainingTime})`;

                if (elapsedTime >= totalLoadingTime) {
                    clearInterval(loadingInterval);
                    clearInterval(countdownInterval);
                    window.location.href = targetUrl;
                }
            }, loadingIntervalTime);

            let remainingSeconds = Math.ceil(totalLoadingTime / 1000);
            countdownInterval = setInterval(function() {
                remainingSeconds--;
                countdownText.textContent = `Iklan... (${remainingSeconds})`;
                if (remainingSeconds <= 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);

        } else {
            messageElement.textContent = "JAWABAN KAMU SALAH.";
            messageElement.className = "error";
            messageElement.classList.remove("hidden");
        }

        passwordInput.value = "";
    });

    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitBtn.click();
        }
    });
});
