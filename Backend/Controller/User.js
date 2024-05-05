import User from '../Models/User.js'
import { generateToken } from '../Utils/Auth.js'
import { catchAsyncErrors } from '../Middleware/CatchAsyncError.js'
import ErrorHandler from '../Middleware/ErrorHandler.js'

export const handleLogin = catchAsyncErrors(async(req,res,next)=>{
    const { email, password } = req.body
    if( !email || !password ) return next(new ErrorHandler("Please Enter All Details", 404))

    const user = await User.findOne({
        email,
    })
    if(!user) return next(new ErrorHandler("Invalid Email!", 400))
    
    const isMatchedPass = await user.comparePassword(password)

    if(!isMatchedPass) return next(new ErrorHandler("Invalid Password"))

    generateToken(user, "Login Successful",201, res)
})

export const handleRegister = catchAsyncErrors(async(req,res, next)=>{
    const { username, email, password } = req.body
    if( !username || !email || !password ) return next(new ErrorHandler("Please Enter All Details", 404))
    
    const isRegistered = await User.findOne({email})
    if(isRegistered) return next(new ErrorHandler("User Already Exists With This Email", 400))
    
    const user = await User.create({
        username,
        email,
        password,
        role: "Customer"
    })
    generateToken(user, "User Registered", 200, res);
})