// src/models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../interfaces/IBook';

// Interface model cho Book, mở rộng từ IBook và Document của Mongoose
export interface IBookModel extends IBook, Document {}

// Định nghĩa schema cho Book
const bookSchema: Schema = new Schema({
  title: { type: String, required: true },        // Tiêu đề sách
  author: { type: String, required: true }       // Tác giả
});

// Tạo và xuất model Book
export const Book = mongoose.model<IBookModel>('Book', bookSchema);
