const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./src/config/database');
const pructRoutes = require('./src/routes/product.routes')

// Load biến môi trường từ .env
dotenv.config();

// Kết nối tới MySQL
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Sử dụng các middleware
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

// Định nghĩa routes
app.use('/api', pructRoutes);

// Route gốc
app.get('/', (req, res) => {
    res.send('Welcome to the F&B Order API');
});

// Đồng bộ các model với database và bắt đầu server
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
