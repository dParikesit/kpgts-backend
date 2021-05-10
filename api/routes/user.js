require('dotenv').config()
const router = require('express').Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authChecker = require('../middleware/auth-checker')
const User = require('../models/user')

router.post('/user/register', (req,res,next)=>{
  bcrypt.hash(req.body.password, 10, (err,hash)=>{
    if(err){
      res.status(500).json({
        message: 'Internal server error'
      })
    }else{
      const newUser = new User({
        email: req.body.email,
        password: hash,
      })
      newUser.save().then(
        result => {
          res.status(200).json({
            message: 'User saved!',
          })
        }
      ).catch(
        err => {
          console.log(err.code)
          if (err.code=='11000'){
            res.status(409).json({
              message: 'User already exists!'
            })
          } else{
            res.status(500).json({
              error: err
            })
          }
        }
      )
    }
  })
})

router.post('/user/login', (req, res, next)=>{
  User.find({email: req.body.email}).then(
    user => {
      if(user.length < 1){
        res.status(404).json({
          message: 'User not found!'
        })
      }
      console.log(user[0].password)
      bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
        if(result==false){
          res.status(401).json({
            message: 'Password incorrect!'
          })
        }
        const token = jwt.sign(
          {
            userId: user[0]._id,
            role: user[0].role
          },
          process.env.JWT_SECRET
        )
        res.status(200).cookie('token', token, {
          maxAge: 3*24*3600,
          httpOnly: true,
          signed: true,
        }).json({
          message: 'Login successful',
          role: user[0].role
        })
      })
    }
  )
})

router.post('/user/logout',authChecker, (req, res)=>{
  res.clearCookie('token', {
    httpOnly: true,
    signed: true
  }).status(200).json({
    message: 'Logout successful',
  })
})

module.exports = router