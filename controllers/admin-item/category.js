const Category = require("../../models/admin-item/category");
//error handler in helper folder
const { errorHandler } = require('../../helpers/admin-item');

exports.insertCategory=(req, res) =>{
    const category = new Category(req.body);


    
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({

                error:errorHandler(err)
            });

        }
        res.json({data});
    })



}

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }
        req.category = category;
        next();
    });
};


exports.read = (req, res) => {
    return res.json(req.category);
};


//fetch category list
exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};


//remove category
//delete product
exports.removeCategory =(req, res)=>{
    let category = req.category;

    category.remove((err,deleteCategory)=>{

        if(err) return res.status(400).json({err});

        res.json({deleteCategory,message:"Category deleted successfully"});

    })

}