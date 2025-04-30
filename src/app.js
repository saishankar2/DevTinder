const express = require('express');

const app = express();

// app.use("/",(req, res, next)=>{   //.use will match all the paths and will execute this middleware for all the requests, so if you want to use this for a specific path then you can use app.get or app.post or app.delete or app.put or app.patch
// //this one gives same response for all the pages as the "/" matches all the paths, to handle this use can use app.get or conditional req.path and pass it to next middleware
//     if(req.path == "/"){
//         res.send("Hey there User!")       // this function is called request handler
//     }
//     else{
//         next();
//     }
// })// this order also matters as it is middleware and is executed in the order it is defined

app.get("/user/:id", (req, res)=>{  //handles the dynamic params like user/60
    console.log(req.params); // read the query params
    res.send({fs: "sai", ls:"shankar"})
})

app.get("/user", (req, res)=>{  // just handles the /user path's get function
    console.log(req.query); // read the query params
    res.send({fs: "sai", ls:"shankar"})
})

app.post("/user", (req, res)=>{  // just handles the /user path's post function
    console.log("Saved");
    res.send({fs: "Virat", ls:"Kohli"})
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
