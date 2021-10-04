const Status = require('../../models/admin-item/status');

//error handler in helper folder
const { errorHandler } = require('../../helpers/admin-item');


exports.orderStatus = (req, res) => {



    //create new user based on request body
    const status = new Status(req.body);
    status.save((err, status) => {

        if (err) {
            return res.status(400).json({
                err: err.message
            });
        }

        //if succefully save 
        res.json({
            status
        });



    });
};

exports.orderStats = (req, res) => {

    try {

        Status.find().exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });




    } catch (error) {
        res.status(404).json({
            result: 'fail',
            message: error
        })
    }

}


exports.orderStatsFilteredGreen = (req, res) => {

    try {

        Status.aggregate([
            {
            "$project": {
                "_id": "$userid",
                "userName":"$username",
                "cancelCount":"$cancel",
                "completeCount":"$completed",
                "progressCount":"$progressing",
               //"TotalSum": { $sum: { $add: ['$cancel', '$completed'] } },
               "cancel"  :{$divide: ["$cancel",{ $sum: { $add: ['$cancel', '$completed'] } }]},
               "complete"  :{$divide: ["$completed",{ $sum: { $add: ['$cancel', '$completed'] } }]}
                             
            }},
            {
                "$match": { "cancel": { "$lte": 0.2 } } 
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });




    } catch (error) {
        res.status(404).json({
            result: 'fail',
            message: error
        })
    }

}



exports.orderStatsFilteredRed = (req, res) => {

    try {

        Status.aggregate([
            {
            "$project": {
                "_id": "$userid",
                "userName":"$username",
                "cancelCount":"$cancel",
                "completeCount":"$completed",
                "progressCount":"$progressing",
               //"TotalSum": { $sum: { $add: ['$cancel', '$completed'] } },
               "cancel"  :{$divide: ["$cancel",{ $sum: { $add: ['$cancel', '$completed'] } }]},
               "complete"  :{$divide: ["$completed",{ $sum: { $add: ['$cancel', '$completed'] } }]}
                             
            }},
            {
                "$match": { "cancel": { "$gte": 0.5 } } 
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });




    } catch (error) {
        res.status(404).json({
            result: 'fail',
            message: error
        })
    }

}



exports.orderStatsFilteredYellow = (req, res) => {

    try {

        Status.aggregate([
            {
            "$project": {
                "_id": "$userid",
                "userName":"$username",
                "cancelCount":"$cancel",
                "completeCount":"$completed",
                "progressCount":"$progressing",
               //"TotalSum": { $sum: { $add: ['$cancel', '$completed'] } },
               "cancel"  :{$divide: ["$cancel",{ $sum: { $add: ['$cancel', '$completed'] } }]},
               "complete"  :{$divide: ["$completed",{ $sum: { $add: ['$cancel', '$completed'] } }]}
                             
            }},
            {
                "$match":{$and: [{"cancel": {$lt: 0.5}}, {"cancel": {$gte: 0.2}}]}
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });




    } catch (error) {
        res.status(404).json({
            result: 'fail',
            message: error
        })
    }

}