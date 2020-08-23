const express = require('express')
const path = require('path')
const app = express()

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')))

app.get('/ping', (req, res) => {
  return res.send('pong')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.post('/ScreenerCriteria', (req, res) => {
  console.log(req.body)

  let spawn = require("child_process").spawn;
  let process = spawn('python3', ["src/scripts/stock_screener.py", req.body[0].display, req.body[0].apiKey])
  let dataString = ''
  process.stdout.on('data', (data) => {
    dataString += data.toString()
  })
  process.stdout.on('end', ()=>{
    res.header('Content-Type', ['application/json']);
    console.log(dataString)
    res.send(dataString)
  })

  // res.send(req.body)
})

app.listen(8080)