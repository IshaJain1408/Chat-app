const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({ 
    username:{type:String, unique:true},
    password:String,
    lastSeen: Date, // Add the lastSeen field

},{timestamps:true});
const UserModel=mongoose.model('User',UserSchema)
module.exports=UserModel;