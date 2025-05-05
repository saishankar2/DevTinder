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

// app.get("/user/:id", (req, res)=>{  //handles the dynamic params like user/60
//     console.log(req.params); // read the query params
//     res.send({fs: "sai", ls:"shankar"})
// })

// app.get("/user", (req, res)=>{  // just handles the /user path's get function
//     console.log(req.query); // read the query params
//     res.send({fs: "sai", ls:"shankar"})
// })

// app.post("/user", (req, res)=>{  // just handles the /user path's post function
//     console.log("Saved");
//     res.send({fs: "Virat", ls:"Kohli"})
// })

// app.use("/hello",(req, res)=>{
//     res.send("Hello World!")       // this function is called request handler
// })

// app.use("/test", (req, res)=>{
//     res.send("You can test here!")       // this function is called request handler
// })

// app.use("/user",
//     [(req,res,next)=>{
//         //throw new Error("Testing error handling"); //Using this to test wildcard error handling at the end
//         console.log("Hey");
//         res.status(200).send("Response 1");   // In this case only the first fn runs, no matter the response is sent or not
//         next();
//     },                            // For acheiving this mechanism we use next() and we can only send any one response
//     (req, res)=>{                 //Even if the next is placed before the res.send we will still get that error(Cannot set headers after they are sent to the client) as the 2nd response will be sent and the 1st one won't
//         console.log("Hi");      // If all the request handlers just calls next(), without any response, then we get an error as there will be no handler that sends a response
//         res.send("Response 2"); //i.e the response should be sent
//     }                          
// ])  // We can wrap the handlers in an array either all or just a few but the behaviour is the same.. app.use("path", [r1, r2], r3, r4)
// // A good practice is to use middlewares in a separate file and just require and use the function here and using try catch is also good for api calls

// app.use("/", (err, req, res, next)=>{  //err should be the first param when used
//     if(err){
//         //You can log your error here
//         res.status(500).send("Something's broken"); //Good way to gracefully send an error
//     }
// //the wild card error handling should be on the end of all the handlers as if some handler throws an error it catches it
// })

const {connectDB} = require("./config/database"); //both parent and child should have {} if you want to use
const User = require("./models/user")

app.post('/signup', async (req,res)=>{
    const userObj = {
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "Virat@gmail.com",
        password: "Kohli@18"
    }
    const user = new User(userObj); //Creating an instance of the model
    try{
        await user.save();
        res.send("User Added");
    }
    catch(err){
        res.status(404).send("Error saving the user");
    }
})
connectDB().then(()=>{
    console.log("MongoDB connected successfully"); //A good way to connect to DB before listening
    app.listen(3000, ()=>{
        console.log("Server is a GO");
    });
  }).catch((err)=>{
    console.log("MongoDB connection failed", err)
  });


