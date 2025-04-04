        document.addEventListener('DOMContentLoaded', function() {
            const passwordInput = document.getElementById('password');
            const submitBtn = document.getElementById('submitBtn');
            const messageElement = document.getElementById('message');
            const correctPassword = "70butir"; // Ganti dengan kata sandi yang sebenarnya
            const targetUrl = "https://link.dana.id/danakaget?c=sepd3r6sy&r=cAYM8h&orderId=20250404101214004515010300166998216236520"; // Ganti dengan URL tujuan
            const successOverlay = document.getElementById('success-overlay');
            const successImage = document.getElementById('success-image');
            const successText = document.getElementById('success-text');
            const loadingBar = document.getElementById('loading-bar');
            const countdownText = document.getElementById('countdown-text');
            const totalLoadingTime = 8000; // 8 detik dalam milisekon
            const loadingIntervalTime = 100; // Interval update loading bar dan countdown
            let elapsedTime = 0;

            submitBtn.addEventListener('click', function() {
                const enteredPassword = passwordInput.value;

                if (enteredPassword === correctPassword) {
                    messageElement.textContent = "Kata sandi benar. Mengarahkan ke daget...";
                    messageElement.className = "success";
                    messageElement.classList.remove("hidden");

                    // Tampilkan overlay sukses
                    successOverlay.style.display = 'flex';

                    let width = 0;
                    const interval = setInterval(function() {
                        elapsedTime += loadingIntervalTime;
                        width = (elapsedTime / totalLoadingTime) * 100;
                        loadingBar.style.width = width + '%';

                        const remainingTime = Math.ceil((totalLoadingTime - elapsedTime) / 1000);
                        countdownText.textContent = `Tunggu... (${remainingTime})`;

                        if (elapsedTime >= totalLoadingTime) {
                            clearInterval(interval);
                            window.location.href = targetUrl;
                        }
                    }, loadingIntervalTime);

                } else {
                    messageElement.textContent = "JAWABAN KAMU SALAH.";
                    messageElement.className = "error";
                    messageElement.classList.remove("hidden");
                }

                // Kosongkan input setelah mencoba
                passwordInput.value = "";
            });

            // Optional: Tekan Enter untuk verifikasi
            passwordInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    submitBtn.click();
                }
            });
        });
