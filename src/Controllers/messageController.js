import {
  getUserMessages,
  sendMessageToContact,
} from "../Reposetories/messageRepo.js";

export const getMessages = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const messages = await getUserMessages(id, userId);
    if (messages.success) {
      res.status(200).json(messages);
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  const { id } = req.params;
  const { text, image } = req.body;
  const userId = req.user._id;

  try {
    const sendmessage = await sendMessageToContact(id, userId, image, text);
    if (sendmessage.success) {
      res.status(200).json(sendmessage);
    } else {
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};
