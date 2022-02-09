var mongoose =require('mongoose')

var userSchema = new mongoose.Schema({

    user_id:'Number',
    user_name:'string',
    email:'string',
    password:'string',
    contact:'string',
    role:'string',

    
})


mongoose.model('User',userSchema);
module.exports = mongoose.model('User')