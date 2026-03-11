const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5000"],
        credentials: true, // if using cookies
    })
);

/** require all routes here */
const authRoute = require('./routes/auth.route');
const interviewRoute = require('./routes/interview.routes');

/** using all routes here */
app.use('/api/auth', authRoute);
app.use('/api/interview', interviewRoute);

/** Serve static files from the React app dist folder */
app.use(express.static(path.join(__dirname, '../public/dist')));

/** 
 * The "catchall" handler: for any request that doesn't 
 * match one above, send back React's index.html file.
 */
app.get('*any', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dist/index.html'));
});

module.exports = app;