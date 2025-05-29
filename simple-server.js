import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import basicAuth from 'express-basic-auth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'tracks.json');
const upload = multer({ dest: 'uploads/' });

const app = express();

// 🔒 HTTP Basic Auth (protects every route)
app.use(basicAuth({
  users: { 'vaultUser': 's3cr3tPass' },
  challenge: true,
  realm: 'The Bunker Vault'
}));

app.use(cors());
app.use(express.json());

let uploadedTracks = [];

// 🔄 Load persisted tracks
if (fs.existsSync(DATA_FILE)) {
  try {
    uploadedTracks = JSON.parse(fs.readFileSync(DATA_FILE));
    console.log(`🔁 Restored ${uploadedTracks.length} tracks from memory`);
  } catch (err) {
    console.error("⚠️ Failed to load tracks.json:", err.message);
  }
}

// 💾 Save tracks to disk
function saveTracks() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(uploadedTracks, null, 2));
  console.log(`💾 Persisted ${uploadedTracks.length} tracks`);
}

// 🛠️ Routes
app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.post('/api/mint/track', upload.single('audio'), (req, res) => {
  const { title, artist } = req.body;

  if (!req.file || !title || !artist) {
    return res.status(400).json({ error: { message: 'Missing audio, title, or artist', status: 400 } });
  }

  const trackId = Date.now().toString();
  const fakeCID = 'bafy' + Math.random().toString(36).slice(2, 10);
  const fakeTxHash = '0x' + Math.random().toString(16).slice(2, 10);

  const newTrack = {
    id: trackId,
    title,
    artist,
    cid: fakeCID,
    txHash: fakeTxHash,
    file: req.file.originalname,
    mimetype: req.file.mimetype,
    size: `${(req.file.size / 1024).toFixed(2)} KB`,
    timestamp: new Date().toISOString(),
    // Local testing URL
    certificateUrl: `http://localhost:${PORT}/api/track/${trackId}/certificate`
  };

  uploadedTracks.push(newTrack);
  saveTracks();

  // 📜 Write individual Guardian certificate
  const certDir = path.join(__dirname, 'certificates');
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);
  const certFile = path.join(certDir, `track_${trackId}.json`);
  fs.writeFileSync(certFile, JSON.stringify(newTrack, null, 2));
  console.log(`🧾 Guardian Certificate saved → ${certFile}`);

  console.log("🔥 New upload certified:", newTrack);
  res.status(201).json(newTrack);
});

app.get('/api/user/:id/tracks', (req, res) => {
  res.json(uploadedTracks);
});

app.get('/api/track/:id/certificate', (req, res) => {
  const track = uploadedTracks.find(t => t.id === req.params.id);
  if (!track) {
    return res.status(404).json({ error: { message: 'Track not found', status: 404 } });
  }
  res.json({ certificateUrl: track.certificateUrl });
});

app.listen(PORT, () => {
  console.log(`✅ Goibniu active at http://localhost:${PORT}`);
});
