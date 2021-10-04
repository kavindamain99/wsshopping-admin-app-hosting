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
const statusRoute = require('./routes/admin-item/status');

//import the routes
const authRoutes = require('./routes/user/auth');
const userRoutes = require('./routes/user/user');

const adminReport = require('./controllers/user/adminReport');


//IT20227036
const advertisementRoutes = require('./routes/admin-offers/advertisement');
app.use("/", advertisementRoutes);

const promotionRoutes = require('./routes/admin-offers/promotion');
app.use("/", promotionRoutes);


//routes middleware
app.use('/api', authRoutes);  
app.use('/api', userRoutes);       

app.use('/api/genReport', adminReport);   

//routes middlware
app.use("/",productRoute);
app.use("/",categoryRoute);
app.use("/",statusRoute);

//heroku deployment
app.get('/',(req,res)=>{
    res.send("hello world")
})

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