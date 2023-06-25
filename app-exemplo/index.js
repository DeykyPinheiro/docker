const express = require('express')
let app = express();

app.use(express.static("."));

app.get("/", (req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

app.listen(process.env.port, ()=>{
    console.log("Server is listening on port " + process.env.port)
})