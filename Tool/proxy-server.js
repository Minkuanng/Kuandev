// proxy-server.js
// Proxy nhỏ để tránh lỗi CORS khi gọi API hanaminikata.com từ trình duyệt.
// Cách chạy:
//   1) npm init -y
//   2) npm install express node-fetch@2 cors
//   3) node proxy-server.js
// Mặc định chạy ở http://localhost:8787

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const TARGET_URL = 'https://hanaminikata.com/dev/buy_device_cloud';

app.post('/api/buy_device_cloud', async (req, res) => {
  try {
    const upstream = await fetch(TARGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { code: -1, message: text }; }

    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ code: -1, message: 'Proxy lỗi: ' + err.message });
  }
});

const PORT = 8787;
app.listen(PORT, () => {
  console.log(`Proxy đang chạy tại http://localhost:${PORT}`);
});
