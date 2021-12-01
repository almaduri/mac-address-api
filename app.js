const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
  origin: "*"
}))

// Create connection
dbHost = process.env.DB_HOST
dbUser = process.env.DB_USER
dbPassword = process.env.DB_PASSWORD
dbDatabase = process.env.DB_DATABASE

const db = mysql.createConnection({
  host     : dbHost,
  user     : dbUser,
  password : dbPassword,
  database : dbDatabase
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
    console.log(result)
    res.send(result)
  })
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

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})