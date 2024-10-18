
import { Hono } from 'hono';
import { Book } from '../models/Book';
import { jwtMiddleware, requireAdminRole } from '../middleware/auth';

const bookRoute = new Hono();

// Lấy danh sách sách (không yêu cầu quyền admin)
bookRoute.get('/', jwtMiddleware, async (c) => {
  const books = await Book.find();
  return c.json(books);
});

// Tạo sách mới (yêu cầu JWT và quyền admin)
bookRoute.post('/', jwtMiddleware, requireAdminRole, async (c) => {
  const { title, author } = await c.req.json();
  const newBook = new Book({ title, author });
  await newBook.save();
  return c.json({ message: 'Book created successfully' }, 201);
});

// Cập nhật sách (yêu cầu JWT và quyền admin)
bookRoute.put('/:id', jwtMiddleware, requireAdminRole, async (c) => {
  const { id } = c.req.param();
  const { title, author } = await c.req.json();

  const updatedBook = await Book.findByIdAndUpdate(
    id,
    { title, author },
    { new: true }
  );
  
  return c.json(updatedBook);
});

// Xóa sách (yêu cầu JWT và quyền admin)
bookRoute.delete('/:id', jwtMiddleware, requireAdminRole, async (c) => {
  const { id } = c.req.param();
  await Book.findByIdAndDelete(id);
  return c.json({ message: 'Book deleted successfully' });
});

export default bookRoute;
