const Advertisement = require('../../models/admin-offers/advertisement');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { errorHandler } = require('../../helpers/admin-offers/dbErrorHandler');

exports.advertisementById = (request, response, next, id) => {
    Advertisement.findById(id).exec((err, advertisement) => {
        if (err || !advertisement) {
            return response.status(400).json({
                error : "Advertisement not found"
            });
        }
        request.advertisement = advertisement
        next(); // check next
    });
};

exports.read = (request, response) => {
    request.advertisement.adImage = undefined;
    return response.json(request.advertisement);
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

        const { adCode, adName, adStartDate, adEndDate } = fields;

        if(!adCode || !adName || !adStartDate || !adEndDate){
            return response.status(400).json({
                error: 'all fields are required'
            });
        }

        let advertisement = new Advertisement(fields);

        if (files.adImage) {
            console.log("Image", files.adImage);
            if(files.adImage.size>1000000){
                return response.status(400).json({
                    error: 'Image size should be less than 1mb'
                });
            }

            advertisement.adImage.data = fs.readFileSync(files.adImage.path);
            advertisement.adImage.contentType = files.adImage.type;
        }

        advertisement.save((error, result) => {
            if (err) {
                console.log('Error! Unable to create advertisement', error);
                return response.status(400).json({
                    error : errorHandler(error)
                });
            }
            response.json(result);
        });
    })
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

        let advertisement = request.advertisement;
        advertisement = _.extend(advertisement, fields);

        if (files.adImage) {
            console.log("Image", files.adImage);
            if(files.adImage.size>8388608){
                return res.status(400).json({
                    error: 'Image size should be less than 1mb'
                });
            }

            advertisement.adImage.data = fs.readFileSync(files.adImage.path);
            advertisement.adImage.contentType = files.adImage.type;
        }

        advertisement.save((error, result) => {
            if (err) {
                console.log('Error! Could not update the advertisement', error);
                return response.status(400).json({
                    error : errorHandler(error)
                });
            }
            response.json(result);
        });
    })
};

exports.remove = (request, response) => {
    let advertisement = request.advertisement;
    advertisement.remove((err, deletedAdvertisement) => {
        if(err) {
            return response.status(400).json({
                err : errorHandler(err)
            });
        }
        response.json({
            deletedAdvertisement,
            "message" : "advertisement deleted"
        });
    });
};

exports.list = (request, response) => {
    let order = request.query.order ? request.query.order : 'asc';
    let sortBy = request.query.sortBy ? request.query.sortBy : '_id';
    let limit = request.query.limit ? parseInt(request.query.limit) : 100;
    Advertisement.find()
        .select('-adImage')
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

exports.adImage = (request, response, next) => {
    if (request.advertisement.adImage.data) {
        response.set("Content-Type", request.advertisement.adImage.contentType);
        return response.send(request.advertisement.adImage.data);
    }
    next();
};
