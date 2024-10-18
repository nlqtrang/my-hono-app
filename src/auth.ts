// src/auth.ts
import { sign, verify } from 'hono/jwt';
import { IUser } from './interfaces/IUser';

const JWT_SECRET = 'your_secret_key';

// Tạo JWT từ thông tin người dùng
export const generateToken = async (user: IUser) => {
  const payload = {
    role: user.role,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token hết hạn sau 5 phút
  };

  return await sign(payload, JWT_SECRET);
};

// Xác thực JWT và phân quyền
export const authenticateJWT = async (token: string) => {
  try {
    return await verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
