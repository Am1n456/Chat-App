import User from "../models/users.model.js"
import bcrypt from "bcryptjs"
import { generateTokens } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.conig.js";

const registerUser = async(req, res) => {
  const {fullName, email, password} = req.body

  try {
    if(!fullName || !email || !password){
      res.status(400).json({message: "All Fields Are Required"})
    }

    const user = await User.findOne({email})

    if(user){
      res.status(400).json({message: "email already exists"})
    }

    if(password.length <= 6){
      res.status(400,{message: "Password Should Minimum be of 6 Characters"})
    }

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    if (newUser){
      generateTokens(newUser._id, res);
      await newUser.save()

      res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePic
      })
    }else{
      res.status(400).json({message: "Invalid User Data:: "})
    }
  } catch (error) {
    console.log("Error in register Controller: ",error.message)
    res.status(500).json({message: "Internal Server Error"})
  }
};

const loginUser = async(req, res) => {
   const {email, password} = req.body;

   try {
    const user = await User.findOne({email})

    if(!user) {
      return res.status(400).json({message: "Invalid User Credentials"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.status(400).json({message: "Invalid User Credentials"})
    }

    generateTokens(user._id, res)

    res.status(200).json({
      message: "User Logged in successfully",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePic
    })

   } catch (error) {
    console.log("Error in Login Controller: ",error.message)
    res.status(500).json({message: "Internal Server Error"})
   }
}

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt","",{maxAge: 0})
    res.status(200).json({message: "User Logged Out SuccessFully"})
  } catch (error) {
    console.log("Error in Logout Controller: ",error.message)
    res.status(500).json({message: "Internal Server Error"})
  }
}

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}; //It will give the information about a authenticated user
export {registerUser, loginUser, logoutUser, updateProfile, checkAuth} 