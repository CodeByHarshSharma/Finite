const express = require('express')
const authController = require('../controllers/auth.controller')
const identifyUser = require('../middleware/auth.middleware')

const authRouter = express.Router()


authRouter.post("/register", authController.registerController),

authRouter.post("/login", authController.loginController)

authRouter.get("/get-me", identifyUser, authController.getMeController)

authRouter.post("/logout", identifyUser, authController.logoutController)

module.exports = authRouter