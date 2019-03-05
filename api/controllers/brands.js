const mongoose = require("mongoose");
var fs = require('fs');
const Brand = require("../models/brand");


exports.brands_get_all = (req, res, next) => {
  Brand.find()   
   
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        message: "Get all brands",
        success: true,
        data: result.map(result => {
          return {           
            _id:result._id,
            name:result.name,
            description:result.description,
            parentId:result.parentId,
            brandImage:result.brandImage,
            status:result.status,            
            updateDate:result.updatedDate,
            createdDate:result.createdDate,
            request: {
              type: "GET",
              url: process.env.SERVER_URL+"brands/" + result._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err 
      });
    });
};

exports.brands_create_brand = (req, res, next) => {
  console.log(req.file);

  
  const brand = new Brand({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    parentId: req.body.parentId,   
    brandImage: req.file.path,   
    status: req.body.status
  });
  brand
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Brand created successfully",
        success: true,
        data:result,
        request: {
          type: "GET",
          url: process.env.SERVER_URL + "brands/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err 
      });
    });
};


exports.brands_get_by_id = (req, res, next) => {
  const id = req.params.brandId;
  Brand.findById(id)
    
    .exec()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).json({
          success: true,
          data: result,
          request: {
            type: "GET",
            url: process.env.SERVER_URL + "brands/"
          }
        });
      } else {
        res.status(404).json({
          success:false,
          message: "There is no valid entry found",             
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err 
      });
    });
};

exports.brands_update_brand = (req, res, next) => {
  const id = req.params.brandId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Brand.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        success:true,
        message: "Brand updated successfully",       
        request: {
          type: "GET",
          url: process.env.SERVER_URL + "brands/" + id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ 
        success: false,
        message: "Internal server error",
        error: err 
      });
    });
};

exports.brands_delete_by_id = (req, res, next) => {
  
  Brand.findById(req.params.brandId)    
    .exec()
    .then(doc => {

      if (doc) {
        Brand.deleteOne({ _id: req.params.brandId })
        .exec()
        .then(result => {
         
          if (fs.existsSync(doc.brandImage)) {
            fs.unlink(doc.brandImage, function (err) {
              console.log('File deleted!');
            });
          }
          res.status(200).json({
            success:true,
            message: "Brand deleted succesfully",
            request: {
              type: "POST",
              url: process.env.SERVER_URL + "brands/",
              body: { name: "String", description: "String", "..":".." }
            }
          });
        })
        .catch(err => {
          res.status(500).json({ 
            success: false,
            message: "Internal server error",
            details: err 
          });
        });
      }else{
        res.status(500).json({ 
          success: false,
          message: "There is no valid entry found to delete",             
        });
      }
     
    }).catch(err =>{
      res.status(500).json({ 
        success: false,
        message: "Internal server error",
        details: err 
      });
    });

 
};