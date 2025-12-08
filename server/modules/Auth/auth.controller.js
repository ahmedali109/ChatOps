import { generateToken } from '../../config/utils.js';
import { UserModel } from '../user/user.model.js';
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

export const login = (req, res) => {
  // Login logic here
};

export const logout = (req, res) => {
  // Logout logic here
};
