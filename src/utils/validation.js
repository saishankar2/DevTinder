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

const validateEditProfile = (req)=>{
   allowedEditFields = ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"];
   const isEditAllowed = Object.keys(req.body).every((k)=>allowedEditFields.includes(k));
   return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfile
}