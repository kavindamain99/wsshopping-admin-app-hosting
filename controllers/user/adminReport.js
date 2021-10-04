var express = require('express');
var router = express.Router();
var pdf = require("pdf-creator-node");
var fs = require("fs");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://wssuper:mern@cluster0.ee9hx.mongodb.net/wickramasuperdb?retryWrites=true&w=majority";

var template = "controllers/user/reportTemplate.html";

var html = fs.readFileSync(template, "utf8");

var options = {
  format: "A3",
  orientation: "portrait",
  border: "7mm",
  footer: {
      height: "0mm",
      contents: {
          first: '',
          2: 'Second page', // Any page number is working. 1-based index
          default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: ''
      }
  }
};

router.get("/",function(req,res,next){
    
    var userCount = 0;
    var deleteCount = 0;
    var userData = [];
    var deleteData = [];

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;

      var dbo = db.db("wickramasuperdb");

      dbo.collection("users").find({})
      .toArray(function(err,result){
          
          if(err) throw err;

          userCount = result.length;
          userData = result;

          console.log(userCount);
          /*result.map((data) => {
            var d = new Date(new Date(data.createdAt).setHours(6,-30,0,0));
            var n = d.toISOString();
            console.log(n);

          });*/
      });

      dbo.collection("deleted_users").find({})
      .toArray(function(err,result){
          
          if(err) throw err;

          deleteCount = result.length;
          deleteData = result;

          console.log(deleteCount);
          /*result.map((data) => {
            var d = new Date(new Date(data.createdAt).setHours(6,-30,0,0));
            var n = d.toISOString();
            console.log(n);

          });*/

          var cDate = new Date();
          var calDate = cDate.toISOString();
          
          var document = {
              html: html,
              data: {
                  registered: (userCount+deleteCount),
                  userCount: userCount,
                  deleteCount: deleteCount,
                  date: calDate.substr(0,10),
                  userData: userData,
                  deleteData: deleteData,
              },
              path: "./report/user_report.pdf",
              type: "",
          };

          pdf.create(document, options)
              .then((res) => {
                  console.log(res);
              })
              .catch((error) => {
                  console.error(error);
              });

          res.download('./report/user_report.pdf');
          res.status(200);

      });

      /*var a = "2021-09-05T00:00:00.000Z";
    

      var b = "2021-09-07T00:00:00.000Z";
      d = new Date(b);
      b = d.toISOString();

      dbo.collection("users").find({
        createdAt: {
          $gte: a,
        }
      }).toArray(function(err,result){
        console.log(result);
      });*/

      //res.json({message:"sanam"});

    }); 
});

module.exports = router;