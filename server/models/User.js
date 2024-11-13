import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type : String,required : true,trim : true},
    email : {type : String,required : true,unique : true},
    password : {type : String,required : true,required : true},
    role : {type: String,enum: ["admin","employee"],required : true},
    profileImage : {type: String},
    createdAt : {type : Date, default: Date.now},
    updatedAt : {type : Date, default: Date.now}
})

const User = mongoose.model("user",userSchema)

export default User