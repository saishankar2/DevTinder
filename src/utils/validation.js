const validator = require('validator');

const validateSignUpData = (req)=>{
   const {firstName, lastName, emailId, password} = req.body;
   if(!firstName || !lastName){
      throw new Error("first and last name is required");
   }
   else if(!validator.isEmail(emailId)){
    throw new Error('Enter correct email')
   }
   else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a stronger password");
   }
};

module.exports = {
    validateSignUpData
}