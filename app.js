require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const userRoute = require('./api/routes/user')
app.use(userRoute)

app.listen(3000 || process.env.PORT, ()=>{
  console.log('Process has started!')
})