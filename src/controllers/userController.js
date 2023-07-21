const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {

    try {

        const userData = req.body
        const { name, email, password } = userData;

        // user validation
        if (!name || !email || !password) {
            return res.status(400).send({ status: false, message: "User all fields are required" });
        }

        // If email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({ status: false, message: "Email Already Registered. Please Login" })
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword;

        const registeredUser = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "Registration Successful", user: registeredUser })

    } catch (error) {
        res.status(500).send({ status: false, message: "Error in User Registration", error: error.message });
    }
}


// User Login

exports.loginUser = async(req,res)=>{
    try {
        
        const userData = req.body
        const { email, password } = userData;

        // user validation
        if (!email || !password) {
            return res.status(400).send({ status: false, message: "User all fields are required" });
        }

        // If email not exists
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(200).send({ status: false, message: "Email Not Found, Please Register" })
        }

        // match password
        const matchedPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchedPassword){
            return res.status(200).send({ status: false, message: "Email or password is invalid" })
        }

        // creating token
        const token = jwt.sign({userId : existingUser._id}, process.env.SECRET_KEY, {expiresIn : "7d"});

        // for assigning tasks to user
        const getAllUsers = await userModel.find({}).select({email : 1,_id : 0});

        const allUsers = []
        getAllUsers.forEach((obj)=>{
              allUsers.push(obj.email);
        })

        return res.status(200).send({status : true, message : "Login Successful", user : existingUser, token :  token, userArray : {users : allUsers}})
    } catch (error) {
        res.status(500).send({ status: false, message: "Error in User Login", error: error.message });        
    }
}