const { Client } = require('whatsapp-web.js');
const { RemoteAuth } = require('@wwebjs/auth-providers');
const { MongoStore } = require('@wwebjs/auth-providers/lib/stores/mongo'); // Jika ingin menyimpan sesi di MongoDB
const qrcode = require('qrcode-terminal');

const danaKagetRegex = /(https:\/\/link\.dana\.id\/danakaget\?c=[a-zA-Z0-9]+&r=[a-zA-Z0-9]+&orderId=\d+)/g;
const groupIdPemilik = 'xxxxxxxxxxx-yyyyyyyyyyyyyy@g.us'; // Ganti dengan ID chat grup pemilik grup

// Konfigurasi untuk menyimpan sesi di MongoDB (opsional)
// const mongoUri = 'YOUR_MONGODB_CONNECTION_STRING';
// const store = mongoUri ? new MongoStore({ uri: mongoUri }) : undefined;

const client = new Client({
    authStrategy: new RemoteAuth({
        clientId: 'bot-detector-silent-dana-kaget', // ID unik untuk sesi
        // store: store, // Gunakan ini jika ingin menyimpan sesi di MongoDB
        backupSync: true // Sinkronkan cadangan sesi secara otomatis
    }),
    disableMentions: false
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Silakan masukkan kode berikut di WhatsApp Anda:');
    const code = qr.split(',')[2]; // Ambil bagian kode dari string QR
    console.log('PAIRING CODE:', code);
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('WhatsApp Bot siap!');
});

client.on('message', async msg => {
    const pesan = msg.body.toLowerCase(); // Ubah pesan menjadi huruf kecil untuk case-insensitive
    const danaKagetLinks = msg.body.match(danaKagetRegex);

    if (danaKagetLinks && danaKagetLinks.length > 0) {
        console.log(`Link DANA Kaget terdeteksi di ${msg.from} dalam pesan:`, msg.body);
        try {
            const chat = await msg.getChat();
            const namaGrupAsal = chat.isGroup ? chat.name : 'Chat Pribadi';
            await client.sendMessage(
                groupIdPemilik,
                `Link DANA Kaget terdeteksi:\n\nDari: ${msg.from}\nNama Grup/Pengirim: ${namaGrupAsal}\nPesan: ${msg.body}`
            );
            console.log(`Pesan dengan link DANA Kaget telah dikirim ke grup pemilik.`);
        } catch (error) {
            console.error('Gagal mengirim pesan ke grup pemilik:', error);
        }
        // Tidak mengirim pesan balasan ke chat asal (sesuai permintaan)
    }

    // Penanganan perintah menggunakan switch case
    if (pesan.startsWith('!')) {
        const command = pesan.substring(1).split(' ')[0]; // Ambil kata pertama setelah '!'

        switch (command) {
            case 'getgroupid':
                const chat = await msg.getChat();
                if (chat.isGroup) {
                    msg.reply(`ID Grup ini adalah: ${chat.id._serialized}`);
                } else {
                    msg.reply('Perintah ini hanya bisa digunakan di dalam grup.');
                }
                break;
            case 'bot': // Penanganan perintah 'bot'
                const contact = await msg.getContact();
                const username = contact.pushname || contact.number;
                msg.reply(`Hai ${username}, saya sudah online dan siap memberikanmu informasi dana kaget dari grup lain. Pastikan kamu mengundangku ke grup yang banyak memberikan link dana kaget ya!`);
                break;
            // Tambahkan case lain untuk perintah lainnya di sini
            default:
                console.log(`Perintah tidak dikenal: ${command}`);
                break;
        }
    } else if (pesan === 'bot') { // Tetap pertahankan ini untuk pesan 'bot' tanpa awalan '!'
        const contact = await msg.getContact();
        const username = contact.pushname || contact.number;
        msg.reply(`Hai ${username}, saya sudah online dan siap memberikanmu informasi dana kaget dari grup lain. Pastikan kamu mengundangku ke grup yang banyak memberikan link dana kaget ya!`);
    }
});

// (Mungkin tidak sepenuhnya efektif untuk story dengan whatsapp-web.js)
client.on('status_change', async status => {
    if (status.broadcast && status.body && status.body.match(danaKagetRegex)) {
        console.log(`Link DANA Kaget terdeteksi di status dari: ${status.author || 'Tidak diketahui'}`);
        try {
            await client.sendMessage(
                groupIdPemilik,
                `Link DANA Kaget terdeteksi di status:\n\nDari: ${status.author || 'Tidak diketahui'}\nStatus: ${status.body}`
            );
            console.log(`Pesan status dengan link DANA Kaget telah dikirim ke grup pemilik.`);
        } catch (error) {
            console.error('Gagal mengirim pesan status ke grup pemilik:', error);
        }
    }
});

client.initialize();
