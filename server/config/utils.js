import jwt from 'jsonwebtoken';

export function generateToken(userId, res) {
  const token = jwt.sign({ userId }, process.env.SESSION_SECRET, {
    expiresIn: '7d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
}
