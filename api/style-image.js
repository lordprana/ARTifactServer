const router = require('express').Router();
const fs = require('fs');
const deepStyle = require('../deep-style/connector');
module.exports = router;

router.post('/', (req, res, next) => {
  const inFile = `${req.user}-in.jpg`
  const outFile = `${req.user}-out.jpg`
  const path = './deep-style/tmp/'
  const photo = Buffer.from(req.body.photo, 'base64')

  fs.writeFileSync(path + inFile, photo, err => console.log(err))
  deepStyle(req.body.style, inFile, outFile)
  .then(_ => {
    const styledImageBuffer = fs.readFileSync(path + outFile)
    const styledImageBase64 = styledImageBuffer.toString('base64')
    res.send(styledImageBase64)
    fs.unlink(path + inFile)
    fs.unlink(path + outFile)
  })
  .catch(err => {
    console.error(err)
    res.sendStatus(500)
  })
});

// uri should be prepended with data:image/jpeg;base64,
