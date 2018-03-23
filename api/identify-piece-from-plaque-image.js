const router = require('express').Router();
const https = require('https');
const { Piece, Artist, Post } = require('../db/models');
module.exports = router;

async function identifyPieceFromRecognizedText(text) {
  text = text.replace(/\n/g, ' ');

  // Remove periods from recognized text, because they are detected
  // unreliably
  text = text.replace(/\./g, '');

  let scores = [];
  let results = [];

  // TODO: Filter pieces by the current museum
  let pieces = await Piece.findAll({
    include: [
      {
        model: Artist
      },
      {
        model: Post,
      }
    ]
  });

  // Score each match depending on if the recognized text contains
  // piece name, artist name, or piece year.
  pieces.forEach(piece => {
    let score = 0;

    // Remove periods from piece name because periods are detected
    // unreliably when doing OCR
    let pieceName = piece.name.replace(/\./g, '');

    if (text.includes(pieceName)) score += 8;
    if (text.includes(piece.artist.name)) score += 4;
    if (text.includes(piece.year)) score += 2;

    if (score >= 8) scores.push({ piece, score });
  });

  // Sort the score by descending order
  scores.sort((a, b) => {
    return b.score - a.score;
  });

  if (scores.length === 0) return results;

  // Add pieces with the highest score to the results and return
  let maxScore = scores[0].score;
  results.push(scores[0].piece);
  for (let i = 1; i < scores.length; i++) {
    if (scores[i].score === maxScore) results.push(scores[i].piece);
    else break;
  }

  return results;
}

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
      const textAnnotation = JSON.parse(res.rawRes).responses[0]
                              .fullTextAnnotation;

      // If no text is identified, return no objects identified
      if (textAnnotation === undefined) {
        return res.json([]);
      }
      const text = textAnnotation.text;
      identifyPieceFromRecognizedText(text)
      .then(pieces => {
        res.json(pieces);
      })
      .catch(next);
    });
  });

  req.on('data', chunk => {
    googleReq.write(chunk);
  });
  req.on('end', () => {
    googleReq.end();
  });
});

// router.post('/', (req, res, next) => {
//   let results = [];
//   Piece.findById(1, {
//     include: [
//       {
//         model: Artist
//       },
//       {
//         model: Post
//       }
//     ]
//   }).then(piece => {
//     results.push(piece);
//     return Piece.findById(2, {
//       include: [
//         {
//           model: Artist
//         },
//         {
//           model: Post
//         }
//       ]
//     });
//   }).then(piece => {
//     results.push(piece);
//     return Piece.findById(3, {
//       include: [
//         {
//           model: Artist
//         },
//         {
//           model: Post
//         }
//       ]
//     });
//   })
// .then(piece => {
//     results.push(piece);
//     res.json(results);
//   });
// });

// router.post('/', (req, res, next) => {
//   let results = [];
//   Piece.findById(2, {
//     include: [
//       {
//         model: Artist
//       },
//       {
//         model: Post
//       }
//     ]
//   })
// .then(piece => {
//     results.push(piece);
//     res.json(results);
//   });
// });
