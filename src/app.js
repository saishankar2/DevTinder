const express = require('express');

const app = express();

app.use("/",(req, res, next)=>{   //this one gives same response for all the pages as the "/" matches all the paths, to handle this use can use app.get or conditional req.path and pass it to next middleware
    if(req.path == "/"){
        res.send("Hey there User!")       // this function is called request handler
    }
    else{
        next();
    }
})

app.use("/hello",(req, res)=>{
    res.send("Hello World!")       // this function is called request handler
})

app.use("/test", (req, res)=>{
    res.send("You can test here!")       // this function is called request handler
})

app.listen(3000, ()=>{
    console.log("Server is a GO");
});
