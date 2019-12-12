const express = require('express')
const fs = require('fs')

const port = 31415
const app = express()


app.get('/', (req, res, next) => {
    let data = null;

    req.on('data', (chunk) => {
        console.log('chunk')
        data += chunk
    })

    req.on('end', () => {
        console.log('finish')
        fs.writeFile('test.txt', data, () => {
            console.log('Write file;')
            res.send('Finish')
        })
    })
})

app.use((error, req, res, next) => {
    console.error(error)
    res.status(500).send(error)
})

app.listen(port, () => console.log('Server works on ' + port))
