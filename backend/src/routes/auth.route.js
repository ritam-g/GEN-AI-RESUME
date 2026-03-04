const express = require('express');
const { registerController, loginUserController, logoutUserController, getMeUserController } = require('../controller/auth.controller');
const authUser = require('../middleware/auth.middleware');


const authRoute=express.Router()
/**
 * @route POST /api/auth/register
 * @description regiester user expects username,email,password
 * @acess public
 */
authRoute.post('/register',registerController)
/**
 * @route POST /api/auth/login
 * @description login user expects email and password
 * @acess public
 */
authRoute.post('/login',loginUserController)
/**
 * @route get /api/auth/logout
 * @description logout user by clearing the token cookie
 * @acess public
 */
authRoute.get('/logout',logoutUserController)
/**
 * @route get /api/auth/getme
 * @description user will get details
 * @acess protected
 */
authRoute.get('/getme',authUser,getMeUserController)

module.exports=authRoute