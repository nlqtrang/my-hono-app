
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/IUser';

// Interface cho model User mở rộng từ Document của Mongoose
interface IUserModel extends IUser, Document {}

// Định nghĩa schema User
const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

// Mã hóa mật khẩu trước khi lưu
// userSchema.pre<IUserModel>('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10); // Kiểu của this.password được xác định là string
//   next();
// });

export const User = mongoose.model<IUserModel>('User', userSchema);
