const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { connectDB, sequelize } = require('./src/config/database');
const productRoutes = require('./src/routes/product.routes');
const categoryRoutes = require('./src/routes/category.routes');

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

//routes
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('Welcome to the F&B Order API');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});