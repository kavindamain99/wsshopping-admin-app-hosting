const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
//validations
const expressValidator = require('express-validator');


//middleware
const morgan = require('morgan');
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(expressValidator());


//import the routes
const productRoute = require('./routes/admin-item/product');
const categoryRoute = require('./routes/admin-item/category');

const advertisementRoutes = require('./routes/admin-offers/advertisement');


const promotionRoutes = require('./routes/admin-offers/promotion');


//import the routes
const authRoutes = require('./routes/user/auth');
const userRoutes = require('./routes/user/user');

//routes middleware
app.use('/api', authRoutes);  
app.use('/api', userRoutes);       

//routes middlware
app.use("/",productRoute);
app.use("/",categoryRoute);
app.use("/", advertisementRoutes);
app.use("/", promotionRoutes);

const port = process.env.PORT || 9000;

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("database connection established");
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});