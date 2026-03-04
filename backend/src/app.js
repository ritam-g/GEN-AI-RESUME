const express = require('express');
const cookieParser=require('cookie-parser')
const cors=require('cors')
const app=express()



app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if using cookies
  })
);


/** require all routes her  */
const authRoute = require('./routes/auth.route');

/**using all routes here */
app.use('/api/auth',authRoute)

module.exports=app