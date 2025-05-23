import Message from "../Models/messageModel.js";
import { uploadResult } from "../Utils/cloudinaryConfig.js";
import cloudinary from "../Utils/cloudinaryConfig.js";

import { io, getReceiverSocketId } from "../Socket.js";
export const getUserMessages = async (contact, user) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderID: user, receiverID: contact },
        { senderID: contact, receiverID: user },
      ],
    });
    return { success: true, messages };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};
export const sendMessageToContact = async (contact, user, image, text) => {
  try {
    let imageUrl;
    if (image) {
      const uploadResponse = await uploadResult(image);
      // console.log(uploadResponse);
      imageUrl = cloudinary.url(uploadResponse.public_id, {
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
          {
            width: 500,
            height: 500,
          },
        ],
      });
    }

    const newMessage = new Message({
      senderID: user,
      receiverID: contact,
      text,
      image,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(contact);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return { success: true, message: "Messagesent successfully", newMessage };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};
