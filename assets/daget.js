        document.addEventListener('DOMContentLoaded', function() {
            const passwordInput = document.getElementById('password');
            const submitBtn = document.getElementById('submitBtn');
            const messageElement = document.getElementById('message');
            const correctPassword = "alquran"; // Ganti dengan kata sandi yang sebenarnya
            const targetUrl = "https://link.dana.id/danakaget?c=srtaja2fj&r=cAYM8h&orderId=20250404101214128115010300166998216088236"; // Ganti dengan URL tujuan

            submitBtn.addEventListener('click', function() {
                const enteredPassword = passwordInput.value;

                if (enteredPassword === correctPassword) {
                    messageElement.textContent = "Kata sandi benar. Nara Mengarahkan ke daget...";
                    messageElement.className = "success";
                    setTimeout(function() {
                        window.location.href = targetUrl;
                    }, 2500); // Tunda sebentar sebelum mengarahkan
                } else {
                    messageElement.textContent = "Kata sandi salah.";
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
