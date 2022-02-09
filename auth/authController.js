const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const config = require('../config')
const User = require('./userModel');
const userModel = require('./userModel');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json())

// all user info

router.get('/users',(req,res)=>{

    User.find({},(err,data)=>{
        if (err) console.log(err) ;
        res.send(data)
    })

})

router.post('/register',(req,res)=>{
    // console.log(req.body.password);
    var hashpassWord = bcrypt.hashSync(req.body.password,8);
    var email = req.body.email
    User.findOne({email:email},(err,data)=>{
        if(data){
            
            res.status(500).send({auth:false,token:"Email id already registerd"})
        }else{
            User.create({
                user_id:Math.floor(Math.random() * 100),
                user_name:req.body.user_name,
                email:req.body.email,
                password:hashpassWord,
                contact:req.body.contact,
                role:req.body.role?req.body.role:'root'
            },(err,data)=>{
                // console.log(password);
                if(err) return res.status(500).send("error while register")
                res.status(200).send('Register Successfully')
            })
        }
    })

})

router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err) return  res.status(500).send({auth:false,token:'Error while login'})
        if(!user) return  res.status(500).send({auth:false,token:'No user Found'})
        else{
            // match the password
            const passIsValid = bcrypt.compareSync(req.body.password,user.password)
            if(!passIsValid) return res.status(500).send({auth:false,token:'Invalid Password'})
            // in case password is valid
            var token = jwt.sign({id:user._id}, config.secret, {expiresIn:86400}) //24 hr
            res.send({auth:true,token:token, userData: user})
        }
    })
})

router.get('/userInfo',(req,res) => {
    var token = req.headers['x-access-token']
    if(!token)  return res.status(500).send({auth:false,token:'No Token Provided'})
    // verify token
    jwt.verify(token, config.secret, (err,user) =>{
        if(err) res.status(500).send({auth:false,token:'Invalid Token'})
        User.findById(user.id,(err,result) => {
            res.send(result)
        })
    })
})

module.exports = router