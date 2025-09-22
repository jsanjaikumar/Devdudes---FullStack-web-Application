const validator = require("validator")

const signupDataValidate = (req)=>{
    const  {firstName, lastName, emailId, password}= req.body

    if(!firstName || !lastName){
        throw new Error("Name is Not vaild")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password")
    }
}

const vaildateEditProfileData = (req)=> {
     
    const AllowedEditFields = [
      "firstName",
      "lastName",
      "about",
      "skills",
      "age",
      "gender",
      "photoUrl",
      "emailId",
    ]

   const isEditAllowed = Object.keys(req.body).every(field => 
    AllowedEditFields.includes(field)
);

   return isEditAllowed;
}

//password faild vaildate
const vaildateEditPassword = (req)=>{
    const onlyPassword = ["password"]

    const isOnlyPassword = Object.keys(req.body).every(field => onlyPassword.includes(field)
);
    return isOnlyPassword;
}

//reuquest interest/ignore api validator
const connectionRequestValidator = (req)=>{
    const AllowedStatus = ["interested", "ignored"];
    
    const isAllowedStatus = Object.keys(req.body)
}

module.exports={
    signupDataValidate,
    vaildateEditProfileData,
    vaildateEditPassword
}