const express = require("express") ;
const {userAuth} = require("../middlewares/auth") ;
const {validateEditProfileData} = require("../utils/validation") ;

const profileRouter = express.Router() ;

//profile
profileRouter.get("/profile/view",userAuth,async (req,res)=> {
   try {
      const user = req.user ;// from userAuth
      res.send(user) ;
   }catch (err) {
      res.status(400).send("ERROR: " + err.message) ;
   }
 });

profileRouter.patch("/profile/edit",userAuth,async(req,res)=> {
   try {
      if(!validateEditProfileData(req)) {
         throw new Error("Invalid Edit Request") ;
      }
      const userToEdit = req.user ;
      Object.keys(req.body).forEach(key => userToEdit[key] = req.body[key]) ; 
      await userToEdit.save() ;
      res.json({
         message: `${userToEdit.firstName} your profile updated successfully`,
         data: userToEdit,
      }) ;

   } catch (err) {
      res.status(400).send("ERROR: " + err.message) ;   
   }
})

module.exports = profileRouter ;