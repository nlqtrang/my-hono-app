// src/middleware/auth.ts
import { Context } from 'hono';
import { authenticateJWT } from '../auth';
import { IUser } from '../interfaces/IUser'; // Import IUser interface

// Middleware xác thực JWT
export const jwtMiddleware = async (c: Context, next: () => Promise<void>) => {
  const token = c.req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return c.json({ message: 'Token is required' }, 401);
  }

  try {
    const decoded = await authenticateJWT(token);
    c.set('user', decoded); // Lưu thông tin người dùng vào context
    await next();
  } catch (err) {
    return c.json({ message: 'Unauthorized' }, 403);
  }
};

// Middleware kiểm tra quyền admin
export const requireAdminRole = async (c: Context, next: () => Promise<void>) => {
  // Lấy thông tin user đã được lưu trong jwtMiddleware
  const user = c.get('user') as IUser;

  // Kiểm tra quyền admin
  if (user.role !== 'admin') {
    return c.json({ message: 'Unauthorized, admin role required' }, 403);
  }

  // Tiếp tục nếu là admin
  await next();
};
