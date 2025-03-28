        async function runAllActions() {
            const botTokenInput = document.getElementById("botToken");
            const chatIdInput = document.getElementById("chatId");
            const responseArea = document.getElementById("response-area");
            const responseDiv = document.getElementById("response");
            const tokenDisplay = document.getElementById("tokenDisplay");
            const chatIdDisplay = document.getElementById("chatIdDisplay");
            const deleteWebhookButtonContainer = document.getElementById("deleteWebhookButtonContainer");
            const inputContainerWrapper = document.querySelector(".input-container-wrapper");

            const botToken = botTokenInput.value.trim();
            const chatId = chatIdInput.value.trim();

            if (!botToken) {
                alert("Harap masukkan Token Bot.");
                return;
            }

            inputContainerWrapper.classList.add("hidden"); // Sembunyikan wrapper input
            responseArea.classList.remove("hidden"); // Tampilkan area respons
            tokenDisplay.textContent = `Token Bot: ${botToken}`;
            if (chatId) {
                chatIdDisplay.textContent = `Chat ID: ${chatId}`;
                chatIdDisplay.classList.remove("hidden");
            } else {
                chatIdDisplay.classList.add("hidden");
            }
            responseDiv.innerHTML = ""; // Bersihkan tampilan sebelumnya
            deleteWebhookButtonContainer.style.display = "none"; // Sembunyikan tombol hapus sebelum memuat

            await performAction("getChat", botToken, chatId, responseDiv);
            await performAction("getMe", botToken, null, responseDiv);
            await performAction("getUpdates", botToken, null, responseDiv);
            await performAction("getWebhookInfo", botToken, null, responseDiv);

            deleteWebhookButtonContainer.style.display = "block"; // Tampilkan tombol hapus setelah semua info dimuat
        }

        async function performAction(action, botToken, chatId, responseDiv) {
            let apiUrl = `https://api.telegram.org/bot${botToken}/`;
            let params = {};
            let actionTitle = "";
            let resultDiv = document.createElement("div");
            let resultContent = "";

            switch (action) {
                case "getChat":
                    actionTitle = "getChat";
                    if (chatId) {
                        apiUrl += "getChat";
                        params.chat_id = chatId;
                    } else {
                        resultContent = `<p>Chat ID tidak diisi.</p>`;
                        resultDiv.innerHTML = `<h3>Nara telah melacak ${actionTitle}:</h3>` + resultContent;
                        responseDiv.appendChild(resultDiv);
                        return;
                    }
                    break;
                case "getMe":
                    actionTitle = "BOTusername";
                    apiUrl += "getMe";
                    break;
                case "getUpdates":
                    actionTitle = "AKTIVITASbot";
                    apiUrl += "getUpdates";
                    break;
                case "getWebhookInfo":
                    actionTitle = "WEBHOOK";
                    apiUrl += "getWebhookInfo";
                    break;
                default:
                    return;
            }

            try {
                const response = await fetch(apiUrl + (action === "getChat" ? "?" + new URLSearchParams(params).toString() : ""));
                const data = await response.json();
                resultContent = formatResult(data);
                resultDiv.innerHTML = `<h3>Nara telah melacak ${actionTitle}:</h3>` + resultContent;
                if (data.ok) {
                    resultDiv.classList.add("response-success");
                } else {
                    resultDiv.classList.add("response-error-bg");
                }
            } catch (error) {
                resultContent = formatError(error);
                resultDiv.innerHTML = `<h3>Error ${actionTitle}:</h3>` + resultContent;
                resultDiv.classList.add("response-error-bg");
            } finally {
                responseDiv.appendChild(resultDiv);
            }
        }

        async function deleteWebhookFlow() {
            const botTokenInput = document.getElementById("botToken");
            const responseDiv = document.getElementById("response");
            const deleteWebhookButton = document.getElementById("deleteWebhookButton");
            const botToken = botTokenInput.value.trim();
            const tokenDisplay = document.getElementById("tokenDisplay");
            const chatIdDisplay = document.getElementById("chatIdDisplay");

            if (!botToken) {
                responseDiv.innerHTML += "<div><h3>Error deleteWebhook:</h3><p>Harap masukkan Token Bot.</p></div>";
                return;
            }

            const apiUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=`;
            const resultDiv = document.createElement("div");
            resultDiv.innerHTML = `<h3>Menghapus Webhook...</h3>`;
            responseDiv.appendChild(resultDiv);
            deleteWebhookButton.classList.add("hidden"); // Sembunyikan tombol saat proses

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                resultDiv.innerHTML = `<h3>Nara telah BERHASIL delete ADS LIVEGRAM:</h3>` + formatResult(data);
                if (data.ok && data.result) {
                    resultDiv.classList.add("response-success");
                    deleteWebhookButton.classList.add("hidden"); // Hilangkan tombol jika berhasil
                    await getLatestWebhookInfo(botToken, responseDiv); // Ambil info webhook terbaru
                } else {
                    resultDiv.classList.add("response-error-bg");
                    deleteWebhookButton.classList.remove("hidden"); // Tampilkan kembali jika gagal
                }
            } catch (error) {
                resultDiv.innerHTML = `<h3>Error deleteWebhook:</h3>` + formatError(error);
                resultDiv.classList.add("response-error-bg");
                deleteWebhookButton.classList.remove("hidden"); // Tampilkan kembali jika error
            } finally {
                responseDiv.appendChild(resultDiv);
            }
        }

        async function getLatestWebhookInfo(botToken, responseDiv) {
            const apiUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;
            const resultDiv = document.createElement("div");
            resultDiv.innerHTML = `<h3>Memuat Webhook Info Terbaru...</h3>`;
            responseDiv.appendChild(resultDiv);

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                resultDiv.innerHTML = `<h3>Nara berhasil memperbarui Webhook Info :</h3>` + formatResult(data);
                if (data.ok) {
                    resultDiv.classList.add("response-success");
                } else {
                    resultDiv.classList.add("response-error-bg");
                }
            } catch (error) {
                resultDiv.innerHTML = `<h3>Error Webhook Info Terbaru:</h3>` + formatError(error);
                resultDiv.classList.add("response-error-bg");
            } finally {
                responseDiv.appendChild(resultDiv);
            }
        }

        function formatResult(data) {
            let formatted = "";
            if (data.ok) {
                formatted = "<pre>" + JSON.stringify(data.result, null, 2) + "</pre>";
            } else {
                formatted = formatError(data);
            }
            return formatted;
        }

        function formatError(error) {
            let errorMessage = "";
            if (typeof error === 'string' || error instanceof String) {
                errorMessage = `<p class="error">${errorMessage}</p>`;
            } else if (error && error.description) {
                errorMessage = `<p class="error">${error.description}</p>`;
            } else if (error && error.message) {
                errorMessage = `<p class="error">${error.message}</p>`;
            } else {
                errorMessage = `<pre class="error">${JSON.stringify(error, null, 2)}</pre>`;
            }
            return errorMessage;
        }