const userModel = require("../model/user.model");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const redis = require("../config/cache");

/**
 * @name registerController
 * @description regiester user expects username,email,password
 * @route POST /api/auth/register
 * @access public
 */
async function registerController(req, res) {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            })
        }
        const exiestUser = await userModel.findOne({
            email
        })
        if (exiestUser) {
            return res.status(401).json({
                success: false,
                message: 'please use different username or email'
            })
        }
        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username, email, password: hash
        })
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '2d' }
        )
        res.cookie("token", token)
        return res.status(201).json({
            message: 'user regiester sucessfully',
            user: {
                id: user._id, email: user.email, username: user.username
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'server error'
        })

    }
}
/**
 * @name loginUserController
 * @description login user expects email and password
 * @route POST /api/auth/login
 * @access public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            })
        }
        const exiestUser = await userModel.findOne({
            email
        }).select('+password')


        if (!exiestUser) {
            return res.status(401).json({
                success: false,
                message: 'pelase register first'
            })
        }
        const isMatch = await bcrypt.compare(password, exiestUser.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'invalid credentials'
            })
        }
        const token = jwt.sign(
            { id: exiestUser._id, username: exiestUser.username, email: exiestUser.email },
            process.env.SECRET_KEY,
            { expiresIn: '2d' }
        )
        res.cookie("token", token)

        return res.status(200).json({
            message: 'user login sucessfully',
            user: {
                id: exiestUser._id, email: exiestUser.email, username: exiestUser.username
            }
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}
/**
 * @name logoutUserController
 * @description logout user by clearing the token cookie
 * @route get /api/auth/logout
 * @access public
 */

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token found",
            });
        }

        // Decode token to get expiry
        const decoded = jwt.decode(token);
        const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);

        // Blacklist token until it expires
        await redis.set(
            `blacklist_${token}`,
            "blacklisted",
            "EX",
            expiryTime
        );

        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}
/**
 * @name getMeController
 * @description get user details by verifying the token in cookie
 * @route get /api/auth/getme
 * @access private
 */
async function getMeUserController(req, res) {
    try {
        const { id } = req.user
        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

module.exports = { registerController, loginUserController, logoutUserController, getMeUserController }