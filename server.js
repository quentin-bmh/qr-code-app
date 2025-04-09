const express = require('express');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Configs
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Dossier des QR codes
const qrDir = path.join(__dirname, 'public', 'qrcodes');
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir, { recursive: true });
}

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/generate', async (req, res) => {
  const url = req.body.url;
  if (!url) return res.send('URL invalide');

  const fileName = `${uuidv4()}.png`;
  const filePath = path.join(qrDir, fileName);

  try {
    await QRCode.toFile(filePath, url, {
      color: {
        dark: '#000',  // noir
        light: '#FFF'  // blanc
      },
      errorCorrectionLevel: 'H'  // Meilleure résistance
    });

    res.render('result', {
      qrImage: `/qrcodes/${fileName}`,
      originalUrl: url
    });
  } catch (err) {
    console.error(err);
    res.send('Erreur lors de la génération du QR code');
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
