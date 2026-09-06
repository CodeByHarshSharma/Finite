const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


async function registerController (req, res) {
    const{ username, email, password, bio, profileImage} = req.body

// Checks if credentials already exists

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409).json({
            message: (isUserAlreadyExists.email == email ? "Email already exists" : "Username already exists")
        })
    }

//password hashing

    const hash = await bcrypt.hash(password, 10) 

// user created

    const user = await userModel.create({
        username,
        email,
        password: hash,
        bio,
        profileImage
    })

//token creation

    const token = jwt.sign({
        id: user._id,
        username: user.username
    },process.env.JWT_SECRET,{expiresIn: "1d"})

    res.cookie("token", token)

    res.status(201).json({
        message: "Account Created!",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

async function loginController (req, res) {
    const {username, email, password} = req.body

//login using username or email
    const user = await userModel.findOne({
        $or: [
            {
                username: username
            },
            {
                email: email
            }
        ]
    }).select('+password')

    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

//verify passowrd

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

//token creation

    const token = jwt.sign({
        id: user._id,
        username: user.username
    },process.env.JWT_SECRET,{expiresIn: "1d"})

    res.cookie("token", token)

    res.status(200).json({
        message: "User Logged IN!",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

async function getMeController (req, res){
    const userId = req.user.id

    const user = await userModel.findById(userId)

    res.status(200).json({
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

module.exports = {
    registerController,
    loginController,
    getMeController
}