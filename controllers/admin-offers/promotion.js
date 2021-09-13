const Promotion = require('../../models/admin-offers/promotion');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { errorHandler } = require('../../helpers/admin-offers/dbErrorHandler');

exports.promotionById = (request, response, next, id) => {
    Promotion.findById(id).exec((err, promotion) => {
        if (err || !promotion) {
            return response.status(400).json({
                error : "Promotion not found"
            });
        }
        request.promotion = promotion
        next(); // check next
    });
};

exports.read = (request, response) => {
    request.promotion.promoImage = undefined;
    return response.json(request.promotion);
};

exports.insert = (request, response) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(request, (err, fields, files) => {
        if(err) {
            return response.status(400).json({
                error : 'Image could not be uploaded'
            });
        }

        const {promoCode, promoName, promoPCode, promoPCategory, promoType, promoDiscount, promoFPCode, promoFPAmount, promoStartDate, promoEndDate} = fields;

        if (!promoCode || !promoName || !promoPCode || !promoPCategory || !promoType || !(promoDiscount || (promoFPCode && promoFPAmount)) || !promoStartDate || !promoEndDate) {
            return response.status(400).json({
                error: 'Necessary fields are not filled'
            });
        }

        let promotion = new Promotion(fields);

        if (files.promoImage) {
            console.log("Image", files.promoImage);
            if(files.promoImage.size>1048576){
                return response.status(400).json({
                    error: 'Image size should be less than 1mb'
                });
            }

            promotion.promoImage.data = fs.readFileSync(files.promoImage.path);
            promotion.promoImage.contentType = files.promoImage.type;
        }

        promotion.save((error, result) => {
            if (err) {
                console.log('Error! Unable to create promotion', error);
                return response.status(400).json({
                    error : errorHandler(error)
                });
            }
            response.json(result);
        });
    });
};

exports.update = (request, response) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(request, (err, fields, files) => {
        if(err) {
            return response.status(400).json({
                error : 'Image could not be uploaded'
            });
        }

        let promotion = request.promotion;
        promotion = _.extend(promotion, fields);

        if (files.promoImage) {
            console.log("Image", files.promoImage);
            if(files.promoImage.size>1000000){
                return res.status(400).json({
                    error: 'Image size should be less than 1mb'
                });
            }

            promotion.promoImage.data = fs.readFileSync(files.promoImage.path);
            promotion.promoImage.contentType = files.promoImage.type;
        }

        promotion.save((error, result) => {
            if (err) {
                console.log('Error! Could not update the promotion', error);
                return response.status(400).json({
                    error : errorHandler(error)
                });
            }
            response.json(result);
        });
    })
};

exports.remove = (request, response) => {
    let promotion = request.promotion;
    promotion.remove((err, deletedPromotion) => {
        if(err) {
            return response.status(400).json({
                err : errorHandler(err)
            });
        }
        response.json({
            deletedPromotion,
            "message" : "Promotion deleted"
        });
    });
};

exports.list = (request, response) => {
    let order = request.query.order ? request.query.order : 'asc';
    let sortBy = request.query.sortBy ? request.query.sortBy : '_id';
    let limit = request.query.limit ? parseInt(request.query.limit) : 100;
    Promotion.find()
        .select('-promoImage')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
        if (err) {
            return response.status(400).json({
                error : errorHandler(err)
            });
        }
        response.json(data);
    });
};

exports.promoImage = (request, response, next) => {
    if (request.promotion.promoImage.data) {
        response.set("Content-Type", request.promotion.promoImage.contentType);
        return response.send(request.promotion.promoImage.data);
    }
    next();
};


