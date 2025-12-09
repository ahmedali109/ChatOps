import jwt from 'jsonwebtoken';
import { UserModel } from '../user/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
    const user = await UserModel.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found.....' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Protect route error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
};
