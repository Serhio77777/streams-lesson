const fs = require('fs');

const fileStream = fs.createReadStream(`${__dirname}/data.txt`);
let fileContent = '';
fileStream.on('data', data => {
  console.log('chunk')
  fileContent += data.toString();
})
fileStream.on('end', () => {
  console.log('End');
})
fileStream.on('error', console.error)
