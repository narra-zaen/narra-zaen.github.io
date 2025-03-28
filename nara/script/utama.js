        const container = document.querySelector('.container');
        const pinDots = document.querySelectorAll('.pin-dots .dot');
        const keyboardKeys = document.querySelectorAll('.keyboard .key[data-value]');
        const backspaceButton = document.querySelector('.backspace');
        const usePasswordButton = document.getElementById('use-password-button');
        const contactUsButton = document.getElementById('contact-us-button');
        const contactUsContainer = document.getElementById('contact-us-container');
        const contactUsNameInput = document.getElementById('contact-us-name');
        const contactUsWhatsappInput = document.getElementById('contact-us-whatsapp');
        const submitContactUsButton = document.getElementById('submit-contact-us');
        const passwordInputContainer = document.getElementById('password-input-container');
        const passwordInput = document.getElementById('password-input');
        const passwordSubmitButton = document.getElementById('password-submit-button');
        const pinErrorMessage = document.getElementById('pin-error-message');
        const passwordErrorMessage = document.getElementById('password-error-message');
        const contactUsErrorMessage = document.getElementById('contact-us-error-message');
        const mainContent = document.getElementById('main-content');
        const loadingOverlay = document.getElementById('loading-overlay');
        const passwordDisplayContainer = document.getElementById('password-display-container');
        const displayedPinElement = document.getElementById('displayed-pin');
        const displayedPasswordElement = document.getElementById('displayed-password');
        const copyPasswordButton = document.getElementById('copy-password-button');
        const enterPasswordButton = document.getElementById('enter-password-button');
        const contactNameDisplay = document.getElementById('contact-name-display');
        let enteredPin = '';
        const possibleCorrectPins = [
        '864378', 
        '789012', 
        '345678', 
        '901234', 
        '567890', 
        '234567', 
        '890123', 
        '456789', 
        '012345', 
        '678901'
        ];
        const correctPin = possibleCorrectPins[Math.floor(Math.random() * possibleCorrectPins.length)];
        const validPasswords = [
            'nararahasia123',
            'narakunciutama',
            'naraakseskilat',
            'naraloginsukses',
            'narakodeverifikasi',
            'naramatahariterbit',
            'narabulanbersinar',
            'narabintangkemilau',
            'narasamudraluas',
            'naragunungtinggi'
        ];
        const initialCorrectPin = correctPin;
        const loadingDuration = 1500;
        const telegramBotToken = '7863353249:AAGeLK7vgDRaqXrdL6dLLSmogSyySPjda7k';
        const telegramChatId = '-4634384561';
        let currentDisplayedPassword = '';
        let currentDisplayedPin = '';
        let textToCopy = '';
        let submittedName = '';

        function generateRandomPin(length = 6) {
            let pin = '';
            const characters = '0123456789';
            for (let i = 0; i < length; i++) {
                pin += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return pin;
        }

        function updatePinDots() {
            pinDots.forEach((dot, index) => {
                dot.style.backgroundColor = index < enteredPin.length ? 'white' : '#ddd';
            });
        }

        keyboardKeys.forEach(key => {
            key.addEventListener('click', () => {
                if (enteredPin.length < correctPin.length) {
                    enteredPin += key.dataset.value;
                    updatePinDots();
                    if (enteredPin.length === correctPin.length) {
                        verifyPin();
                    }
                }
            });
        });

        backspaceButton.addEventListener('click', () => {
            enteredPin = enteredPin.slice(0, -1);
            updatePinDots();
            pinErrorMessage.textContent = '';
        });

        function showLoading() {
            loadingOverlay.style.display = 'flex';
        }

        function hideLoading() {
            loadingOverlay.style.display = 'none';
        }

        function verifyPin() {
            if (enteredPin === correctPin) {
                showLoading();
                setTimeout(() => {
                    hideLoading();
                    container.style.display = 'none';
                    mainContent.style.display = 'block';
                }, loadingDuration);
            } else {
                pinErrorMessage.textContent = 'PIN salah!';
                enteredPin = '';
                updatePinDots();
            }
        }

        usePasswordButton.addEventListener('click', () => {
            document.querySelector('.title').textContent = 'Masukkan Sandi (Nama)';
            document.querySelector('.pin-dots').style.display = 'none';
            document.querySelector('.keyboard').style.display = 'none';
            contactUsButton.style.display = 'none';
            usePasswordButton.style.display = 'none';
            passwordInputContainer.style.display = 'flex';
            contactUsContainer.style.display = 'none';
            passwordDisplayContainer.style.display = 'none';
            pinErrorMessage.textContent = '';
            enteredPin = '';
            updatePinDots();
        });

        passwordSubmitButton.addEventListener('click', () => {
            const enteredPassword = passwordInput.value.toLowerCase();
            if (validPasswords.includes(enteredPassword)) {
                showLoading();
                setTimeout(() => {
                    hideLoading();
                    container.style.display = 'none';
                    mainContent.style.display = 'block';
                }, loadingDuration);
            } else {
                passwordErrorMessage.textContent = 'Sandi salah!';
                passwordInput.value = '';
            }
        });

        contactUsButton.addEventListener('click', () => {
            document.querySelector('.title').textContent = '';
            document.querySelector('.pin-dots').style.display = 'none';
            document.querySelector('.keyboard').style.display = 'none';
            usePasswordButton.style.display = 'none';
            contactUsButton.style.display = 'none';
            passwordInputContainer.style.display = 'none';
            contactUsContainer.style.display = 'flex';
            passwordDisplayContainer.style.display = 'none';
            pinErrorMessage.textContent = '';
            enteredPin = '';
            updatePinDots();
        });

        submitContactUsButton.addEventListener('click', () => {
            const name = contactUsNameInput.value.trim();
            const whatsapp = contactUsWhatsappInput.value.trim();
            contactUsErrorMessage.textContent = '';

            if (!name) {
                contactUsErrorMessage.textContent = 'Nama tidak boleh kosong.';
                return;
            }

            submittedName = name;
            const randomIndex = Math.floor(Math.random() * validPasswords.length);
            currentDisplayedPassword = validPasswords[randomIndex];
            currentDisplayedPin = initialCorrectPin; // Gunakan PIN utama yang ditampilkan secara acak di awal
            textToCopy = currentDisplayedPassword;

            const message = `Pesan Kontak:\nNama: ${name}\nWhatsApp: ${whatsapp}`;
            const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(message)}`;

            showLoading();
            fetch(telegramUrl)
                .then(response => response.json())
                .then(data => {
                    hideLoading();
                    console.log('Pesan Telegram Terkirim:', data);
                    alert('Pesan Anda telah terkirim ke Telegram.');
                    contactUsContainer.style.display = 'none';
                    passwordDisplayContainer.style.display = 'flex';
                    contactNameDisplay.textContent = submittedName;
                    displayedPinElement.textContent = currentDisplayedPin.split('').join('-');
                    displayedPasswordElement.textContent = currentDisplayedPassword;
                    contactUsNameInput.value = '';
                    contactUsWhatsappInput.value = '';
                })
                .catch((error) => {
                    hideLoading();
                    console.error('Gagal mengirim pesan ke Telegram:', error);
                    contactUsErrorMessage.textContent = 'Terjadi kesalahan saat mengirim pesan ke Telegram.';
                });
        });

        copyPasswordButton.addEventListener('click', () => {
            navigator.permissions.query({ name: 'clipboard-write' }).then(permissionStatus => {
                if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            alert('Sandi berhasil disalin!');
                        })
                        .catch(err => {
                            console.error('Gagal menyalin sandi: ', err);
                            alert('Gagal menyalin sandi.');
                        });
                } else {
                    alert('Izin untuk menyalin ke clipboard ditolak. Silakan periksa pengaturan browser Anda.');
                }
            });
        });

        enterPasswordButton.addEventListener('click', () => {
            passwordDisplayContainer.style.display = 'none';
            container.style.display = 'flex';
            document.querySelector('.title').textContent = 'Masukkan Sandi (Nama)';
            document.querySelector('.pin-dots').style.display = 'none';
            document.querySelector('.keyboard').style.display = 'none';
            usePasswordButton.style.display = 'none';
            contactUsButton.style.display = 'none';
            passwordInputContainer.style.display = 'flex';
            currentDisplayedPassword = '';
            currentDisplayedPin = '';
            textToCopy = '';
            passwordInput.value = '';
            passwordErrorMessage.textContent = '';
        });

        // Script untuk main-content
        const menuButton = document.querySelector('#main-content .menu-button');
        const menuList = document.querySelector('#main-content .menu-list');
        const contents = document.querySelectorAll('#main-content .content');
        const copyright = document.querySelector('#main-content .copyright');
        let isCopyrightVisible = true;
        let touchTimer;

        if (menuButton && menuList && contents) {
            menuButton.addEventListener('click', () => {
                menuList.classList.toggle('show');
            });

            menuList.addEventListener('click', (event) => {
                if (event.target.tagName === 'BUTTON') {
                    event.preventDefault();
                    const contentId = event.target.dataset.content;
                    contents.forEach(content => content.classList.remove('show'));
                    document.getElementById(contentId).classList.add('show');
                    menuList.classList.remove('show');
                }
            });
        }

        document.addEventListener('touchstart', () => {
            clearTimeout(touchTimer);
            if (isCopyrightVisible && copyright) {
                copyright.style.opacity = '0';
                isCopyrightVisible = false;
            }
        });

        document.addEventListener('touchend', () => {
            touchTimer = setTimeout(() => {
                if (!isCopyrightVisible && copyright) {
                    copyright.style.opacity = '1';
                    isCopyrightVisible = true;
                }
            }, 1000);
        });
