const {
  Readable,
  Writable,
  Transform,
  pipeline
} = require('stream')

function clock() {
  const readStream = new Readable({
    objectMode: true,
    read() {}
  })
  let counter = 0
  const interval = setInterval(() => {
    counter++
    if (counter === 2) {
      readStream.destroy(new Error('test'))
      clearInterval(interval)
    }
    readStream.push({ time: new Date() })
  }, 1000)
  
  readStream
    .on('data', (data) => { console.log('Data', data) })
    .on('error', (err) => { console.log('!', err.message) })
    .on('close', () => { console.log('** bye') })
    .on('finish', () => { console.log('** bye') })
  
  return readStream 
} 

function transformStreamData () {
  let count = 0

  return new Transform({
    objectMode: true,
    transform: (data, _, done) => {
      done(null, { ...data, index: count++ })
    }
  })
}

function render () {
  return new Writable({
    objectMode: true,
    write(data, _, done) {
      console.log('<-', data)
      done()
    }
  })
}

// pipeline(
//   clock,
//   transformStreamData,
//   render,
//   (error) => {
//     if (error) {
//       console.error('Pipeline failed', error);
//     } else {
//       console.log('Pipeline succeeded');
//     }
//   }
// )
clock()
  .pipe(transformStreamData())
  .pipe(render())

// let startTime = Date.now()
// s3.getObject({Bucket: 'some-bucket', Key: 'tweets.gz'}, (err, data) => {
//   // here, the whole file was downloaded
//   zlib.gunzip(data.Body, (err, data) => {
//     // here, the whole file was unzipped
//     fs.writeFile(`${__dirname}/tweets.json`, data, err => {
//       if (err) console.error(err)
//       // here, the whole file was written to disk
//       var endTime = Date.now()
//       console.log(`${endTime - startTime} milliseconds`) // 1339 milliseconds
//     })
//   })
// })

// s3.getObject({Bucket: 'some-bucket', Key: 'tweets.gz'})
//   .createReadStream()
//  .pipe(zlib.createGunzip())
//  .pipe(fs.createWriteStream(`${__dirname}/tweets.json`));

// const fs = require('fs');
// const zlib = require('zlib');

// pipeline(
//   fs.createReadStream('videos/Firey_Nebula_4K_Motion_Background.mp4'),
//   zlib.createGzip(),
//   fs.createWriteStream('package/Firey_Nebula_4K_Motion_Background.mp4.gz'),
//   (error) => {
//     if (error) {
//       console.error('Pipeline failed', error);
//     } else {
//       console.log('Pipeline succeeded');
//     }
//   }
// );