import { getRecieverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js"
import User from "../models/users.model.js"
import cloudinary from "cloudinary"
import { io } from "../lib/socket.js";

const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUser = await User.find({
            _id: {$ne: loggedInUser}
        }).select("-password")
    
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const sendMessage = async(req, res) => {
    try {
        const {text, image} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id
    
        let imageURL;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }
    
        let newMessage = new Message({
            senderId: senderId,
            recieverId: recieverId,
            text,
            image: imageURL,
        })
    
        await newMessage.save();

        const receiverSocketId = getRecieverSocketId(recieverId)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
    
        res.status(201).json(newMessage) //201 :- status code for a created message
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log("Error in sendMessage Controller: ",error.message)
    }
};

const getMessages = async(req, res) => {
    try {
        const myId = req.user._id;
        const {id: userToChatId} = req.params
    
        const messages = await Message.find({
            $or: [
                {senderId: myId, recieverId: userToChatId},
                {senderId: userToChatId, recieverId: myId}
            ]
        })
    
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log("Error in getMessages controller: ",error.message)
    }
}

export {getUsersForSidebar, sendMessage, getMessages}