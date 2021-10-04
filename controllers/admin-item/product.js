const Product = require("../../models/admin-item/product");


//error handler in helper folder
const { errorHandler } = require('../../helpers/admin-item');


//formidable dependency for form handling
const formidable = require("formidable");
const _ = require("lodash");

const fs = require("fs");



//insert new product
exports.insert = (req, res) => {


    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //form validation
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "image could not be uploaded" });
        }


        //validate all fields
        const { item_code, item_name, item_category, item_type, item_quantity, item_weight, item_price, item_description,item_shipping } = fields;

        if (!item_code || !item_name || !item_category  || !item_quantity || !item_weight || !item_price || !item_description) {
            return res.status(400).json({
                error: 'all fields must be required'
            });
        }


        let product = new Product(fields);

        if (files.item_image) {
            //console photo details like size 
            console.log("file photo", files.item_image);

            //check photo size and validate
            //1mb=1000000

            if (files.item_image.size > 1000000) {
                return res.status(400).json({
                    error: 'Image size should be less than 1mb'
                });
            }




            product.item_image.data = fs.readFileSync(files.item_image.path);
            product.item_image.contentType = files.item_image.type;
        }

        product.save((err, resulst) => {
            if (err) {
                return res.status(400).json({
                    error:err.message
                });
            }
            res.json(resulst);

        })


    })
}


//create productbyid middleware

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product Not Found"
            });
        }

        //if product found base on id
        req.product = product;


        //perform this middleware and contine application
        next();

    });
}

//request a single product using above middleware
exports.readProduct = (req, res) => {

    //this will make separate request to take photo from database   

    req.product.item_image = undefined;

    return res.json(req.product);
}

//fetch product Image separately 

exports.getImage = (req, res,next) => {
 
    if(req.product.item_image.data){
        res.set('Content-Type',req.product.item_image.contentType);
        return res.send(req.product.item_image.data)
    }
    next();
    
};


//delete product
exports.removeProduct =(req, res)=>{
    let product = req.product;

    product.remove((err,deleteProduct)=>{

        if(err) return res.status(400).json({err});

        res.json({deleteProduct,message:"product deleted successfully"});

    })

}



//update product

//in a update method we going to take a existing product
//instead of using new keywords 


exports.updateProduct =(req, res)=>{

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"image could not be uploaded"
            });
        }

        //take existing product
        //for that use extend from loadash library
        let product = req.product;
        //first arguement is request second one is update fields 
        product =_.extend(product,fields);

      

        
        if(files.item_image){
            //console photo details like size 
            //console.log("file photo",files.photo);

            //check photo size and validate
            //1mb=1000000

            if(files.item_image.size>1000000){
                return res.status(400).json({
                    error: 'Photo size should be less than 1mb'
                });
            }




            product.item_image.data = fs.readFileSync(files.item_image.path);
            product.item_image.contentType = files.item_image.type;
        }

        product.save((err,resulst)=>{
            if(err){
                return res.status(400).json({err});
            }
            res.json(resulst);
            
        })

    })

}



//fetch product list

exports.listProduct =(req, res)=>{
    //fetch 10 product by default
    let limit = req.query.limit ? parseInt(req.query.limit):10; 

    Product.find()
    .select("-item_image")
    .limit(limit)
    .exec((err,data)=>{

        if(err){
            return res.status(400).json({error:"product Not Found"});
        }

        res.json(data);
    });
}


//fetch category list
exports.categoryStats = (req, res) => {
    Product.aggregate([{
        "$group": {
            "_id": "$item_category",
            "count":{$sum:1}

        }
    }]).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};