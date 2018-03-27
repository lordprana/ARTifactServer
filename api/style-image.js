const router = require('express').Router();
const fs = require('fs');
const { promisify } = require('util')
const { deepStyle } = require('../deep-style/connector');
module.exports = router;

const readFile = promisify(fs.readFile.bind(fs))
const writeFile = promisify(fs.writeFile.bind(fs))

router.post('/', async (req, res, next) => {
  try {
    const inFile = `${req.auth}-in.jpg`
    const outFile = `${req.auth}-out.jpg`
    const path = './deep-style/tmp/'
    const photo = Buffer.from(req.body.photo, 'base64')

    await writeFile(path + inFile, photo, err => console.log(err))
    await deepStyle(req.body.style, inFile, outFile)

    const styledImageBuffer = await readFile(path + outFile)
    const styledImageBase64 = styledImageBuffer.toString('base64')
    res.send(styledImageBase64)
    //fs.unlink(path + inFile)
    //fs.unlink(path + outFile)
  } catch (err) {
    next(err)
  }
});

// uri should be prepended with data:image/jpeg;base64,
