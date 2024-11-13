const express = require("express") ;
const {userAuth} = require("../middlewares/auth") ;
const {validateEditProfileData} = require("../utils/validation") ;
const bcrypt = require("bcrypt") ;

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

profileRouter.patch("/profile/password",userAuth,async (req,res)=> {
   try{
      const user = req.user ;
      const {oldPassword,newPassword} = req.body ;
      const isOldPasswordValid = await user.validatePassword(oldPassword) ;
      if(!isOldPasswordValid) {
         throw new Error("Old password is incorrect") ;
      }

      const newPasswordHash = await bcrypt.hash(newPassword,10) ;
      user.password = await newPasswordHash ; 
      user.save() ;

      res.json({
         message: `${user.firstName} your password updated successfully`,
      }) ;

   }catch (err) {
      res.status(400).send("ERROR: " + err.message) ;
   }
})

module.exports = profileRouter ;