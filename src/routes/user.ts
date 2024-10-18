// src/routes/user.ts
import { Context, Hono } from 'hono';
import { User } from '../models/User';
import { generateToken } from '../auth';
import { jwtMiddleware, requireAdminRole } from '../middleware/auth';
import { IUser } from '../interfaces/IUser';
import { log } from 'console';
import bcrypt from 'bcryptjs';

const userRoute = new Hono();


// Đăng ký người dùng
userRoute.post('/register', async (c) => {
    const { username, password, role } = await c.req.json();
  
    // Kiểm tra xem người dùng đã tồn tại hay chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) return c.json({ message: 'User already exists' }, 400);
  
    // Tạo người dùng mới với mật khẩu đã mã hóa
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
  
    return c.json({ message: 'User registered successfully' }, 201);
  });

// Đăng nhập người dùng
userRoute.post('/login', async (c) => {
  const { username, password} = await c.req.json();
  const user = await User.findOne({ username });
  if (!user) return c.json({ message: 'User not found' }, 404);
  log(user);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return c.json({ message: 'Invalid password' }, 401);

  const token = await generateToken(user);
  return c.json({ token: 'Bearer '+token });
});

// Lấy thông tin người dùng (yêu cầu JWT)
userRoute.get('/me', jwtMiddleware, async (c: Context) => {
    const user = c.get('user') as IUser;
    return c.json(user);
  });

// Cập nhật thông tin người dùng (yêu cầu JWT)
userRoute.put('/update', jwtMiddleware, requireAdminRole, async (c: Context) => {
    // Ép kiểu giá trị lấy từ Context thành IUser
    const user = c.get('user') as IUser;
    const { username, role } = await c.req.json();

  
    // Tìm và cập nhật người dùng trong MongoDB
    const updatedUser = await User.findOneAndUpdate(
      {username},// Điều kiện tìm kiếm: tìm theo username
      { role },
      { new: true }
    );
  
    return c.json(updatedUser);
  });
  

// Xóa người dùng (yêu cầu JWT)
userRoute.delete('/delete', jwtMiddleware, async (c: Context) => {
    // Ép kiểu giá trị lấy từ Context thành IUser
    const user = c.get('user') as IUser;
  
    const username = user.username;

    // Xóa người dùng trong MongoDB bằng username
    const deletedUser = await User.findOneAndDelete({ username });
  
    return c.json({ message: 'User deleted successfully' });
  });

export default userRoute;
