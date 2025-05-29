const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/mint/track', upload.single('audio'), (req, res) => {
  const { title, artist } = req.body;
  if (!req.file || !title || !artist) {
    return res.status(400).json({
      error: {
        message: 'Missing required fields: audio, title, or artist',
        status: 400,
      },
    });
  }

  const fakeCID = 'bafy' + Math.random().toString(36).substring(2, 10);
  const fakeTxHash = '0x' + Math.random().toString(16).substring(2, 10);

  res.status(201).json({
    id: Date.now().toString(),
    cid: fakeCID,
    txHash: fakeTxHash,
  });
});

app.get('/api/user/1/tracks', (req, res) => {
  res.json([
    {
      id: 'track_001',
      title: 'Test Track',
      metadata_cid: 'bafy123',
      txHash: '0xabc123',
    },
  ]);
});

app.get('/api/track/:id/certificate', (req, res) => {
  res.json({
    certificateUrl: `https://ipfs.io/ipfs/bafybeieennrc2b3...${req.params.id}`,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Goibniu is running at http://localhost:${PORT}`)); 