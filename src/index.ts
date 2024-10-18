import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'
import { some, every, except } from 'hono/combine'
import { connectDB } from './db'; // Hàm kết nối MongoDB
import userRoute from './routes/user';
import bookRoute from './routes/book';

const app = new Hono()
app.use(prettyJSON()) // With options: prettyJSON({ space: 4 })
//middleware làm cho json trở nên đẹp hơn
app.use(logger()) // Log request and response


// Kết nối MongoDB
connectDB();

// Gắn các route// Sử dụng app.use() để gắn route cho user
app.route('/users', userRoute);
app.route('/books', bookRoute); 

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
