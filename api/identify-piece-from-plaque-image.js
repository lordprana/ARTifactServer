const router = require('express').Router();
const https = require('https');
module.exports = router;

router.post('/', (req, res, next) => {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  const contentLength = req.get('Content-Length');

  const options = {
    hostname: 'vision.googleapis.com',
    path: `/v1/images:annotate?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': contentLength
    }
  };

  const googleReq = https.request(options, googleRes => {
    res.status(googleRes.statusCode);
    res.rawRes = '';
    googleRes.setEncoding('utf8');
    googleRes.on('data', (chunk) => {
      res.rawRes += chunk;
    });
    googleRes.on('end', () => {
      res.json(JSON.parse(res.rawRes));
    });
  });

  req.on('data', chunk => {
    googleReq.write(chunk);
  });
  req.on('end', () => {
    googleReq.end();
  });
});
