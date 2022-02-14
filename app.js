const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv/config')
const { connectDB } = require('./configs/database');

const airdropRoute = require('./routes/airdrop');
const userRoute = require('./routes/user');

const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/airdrop", airdropRoute);
app.use("/api/user", userRoute);

app.get("/api/ok", (req, res) => {
    res.json({ status: 200, message: "I'm here :)" });
})

// Unmatched routes handler
app.use(function (req, res) {
    if (req.method.toLowerCase() === "options") {
        res.end();
    } else {
        res.status(404).json({ message: "Not Found" });
    }
});

connectDB();
app.listen(PORT, (err) => {
    if (err) {
        console.error("An error occurred: ", err);
    }
    console.log("Server is running on port ", PORT);
});