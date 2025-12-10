import { UserModel } from '../user/user.model.js';
import { MessageModel } from './messages.model.js';
import cloudinary from '../../config/cloudinary.js';

export const getSidebarUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const users = await UserModel.find({ _id: { $ne: currentUserId } }).select(
      '-password'
    );
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Get sidebar users error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResponse = await cloudinary.uploader.upload(dataURI);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      text: text || '',
      image: imageUrl,
    });

    await newMessage.save();

    return res
      .status(201)
      .json({ message: 'Message sent successfully.', newMessage });
  } catch (error) {
    console.error('Send message error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};
