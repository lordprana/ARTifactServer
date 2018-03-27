const PythonShell = require('python-shell')

// https://github.com/joelnet/functional-helpers/blob/master/promisify.js
/* eslint-disable no-confusing-arrow */
function promisify(func, self) {
  return (...args) => {
      return new Promise((resolve, reject) => {
          const callback = (err, data) => err ? reject(err) : resolve(data)
          func.apply(self, [...args, callback])
      })
  }
}

const styleImage = (folderOffset = '', relImageFolder, relCkptFolder, ckptName, inFile, outFile) => {
  const run = promisify(PythonShell.run)
  const options = {
    pythonPath: 'python3',
    args: [
    `--checkpoint`, folderOffset + relCkptFolder + ckptName + '.ckpt',
    `--in-path`, folderOffset + relImageFolder + inFile,
    `--out-path`, folderOffset + relImageFolder + outFile
  ] }
  return run(folderOffset + 'evaluate.py', options)
}

module.exports = styleImage.bind(null, 'deep-style/', 'tmp/', 'examples/models/')
