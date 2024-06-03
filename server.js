const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { connectDB, sequelize } = require('./src/config/database');
const productRoutes = require('./src/routes/product.routes');

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

<<<<<<< HEAD
app.use('/api', productRoutes);

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
=======
// Định nghĩa routes
app.use('/api', productRoutes);

>>>>>>> 526c271 (feature: get api)

app.get('/', (req, res) => {
    res.send('Welcome to the F&B Order API');
});

<<<<<<< HEAD
=======
// Đồng bộ các model với database và bắt đầu server
>>>>>>> 526c271 (feature: get api)
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


