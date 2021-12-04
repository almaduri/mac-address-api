const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: "*"
}))

app.use(express.json())

// Create connection
dbHost = process.env.DB_HOST
dbUser = process.env.DB_USER
dbPass = process.env.DB_PASS
dbName = process.env.DB_NAME

const db = mysql.createConnection({
  host     : dbHost,
  user     : dbUser,
  password : dbPass,
  database : dbName
})

// Connect
db.connect((err) => {
  if(err) {
    throw err
  }
  console.log(`MySql Connected...`);
})

// Handle server disconnect
setInterval(() => {
  db.query('SELECT 1')
}, 5000)

app.get('/getmacs', (req, res) => {
  const sql = `SELECT * FROM mac_list ORDER BY mac_list.mac_address ASC`
  const query = db.query(sql, (err, result) => {
    if(err) throw err
    // console.log(result)
    res.send(result)
  })
})

app.post('/post', (req, res) => {
  // const sql = `SELECT * FROM mac_list ORDER BY mac_list.name ASC`
  // const query = db.query(sql, (err, result) => {
  //   if(err) throw err
  //   console.log(result)
  //   res.send(result)
  // })

  console.log(req.body)
})

app.get('/update/:mac/:name', (req, res) => {
  const name = req.params.name
  const mac = req.params.mac
  const sql = `UPDATE mac_list SET name = '${name}' WHERE mac_list.mac_address = '${mac}'`
  const query = db.query(sql, (err, result) => {
    if(err) throw err
    console.log(result)
    res.send(`Updated ${mac}`)
  })
})

app.get('/add/:mac/:name', (req, res) => {
  const newMac = {name: req.params.name, mac_address: req.params.mac}
  const sql = `INSERT INTO mac_list SET ?`
  const query = db.query(sql, newMac, (err, result) => {
    if(err) throw err
    console.log(result)
    res.send(`Added ${req.params.mac}`)
  })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})