const PythonShell = require('python-shell')
const { promisify } = require('util')

const run = promisify(PythonShell.run.bind(PythonShell))

const styleImage = (folderOffset = '', relImageFolder, relCkptFolder, ckptName, inFile, outFile) => {
  const options = {
    pythonPath: 'python3',
    args: [
    `--checkpoint`, folderOffset + relCkptFolder + ckptName + '.ckpt',
    `--in-path`, folderOffset + relImageFolder + inFile,
    `--out-path`, folderOffset + relImageFolder + outFile
  ] }
  return run(folderOffset + 'evaluate.py', options)
}

module.exports = {
  deepStyle: styleImage.bind(null, 'deep-style/', 'tmp/', 'examples/models/'),
}
