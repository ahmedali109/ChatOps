import { generateToken } from '../../config/utils.js';
import { UserModel } from '../user/user.model.js';
import cloudinary from '../../config/cloudinary.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long.' });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        message: 'User created successfully.',
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
        },
      });
    } else {
      return res.status(500).json({ message: 'Error creating user.' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', { maxAge: 0 });
    return res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    console.error('Logout error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let profilePictureUrl;

    if (req.file) {
      // Convert buffer to base64 for cloudinary upload
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResponse = await cloudinary.uploader.upload(dataURI);
      profilePictureUrl = uploadResponse.secure_url;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture: profilePictureUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ message: 'You are authenticated', user: req.user });
  } catch (error) {
    console.error('CheckAuth error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};
