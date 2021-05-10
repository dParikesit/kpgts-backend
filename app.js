require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('DB Connection succeed')
});


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const userRoute = require('./api/routes/user')
app.use(userRoute)

app.listen(process.env.PORT || 3000, ()=>{
  console.log('Process has started!')
})