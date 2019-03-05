const mongoose = require("mongoose");
var fs = require('fs');
const Category = require("../models/category");


exports.categories_get_all = (req, res, next) => {
  Category.find()   
   
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        message: "Get all categories",
        success: true,
        data: result.map(result => {
          return {           
            _id:result._id,
            name:result.name,
            description:result.description,
            parentId:result.parentId,
            categoryImage:result.categoryImage,
            status:result.status,            
            updateDate:result.updatedDate,
            createdDate:result.createdDate,
            request: {
              type: "GET",
              url: process.env.SERVER_URL+"categories/" + result._id
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

exports.categories_create_category = (req, res, next) => {
  console.log(req.file);

  
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    parentId: req.body.parentId,   
    categoryImage: req.file.path,   
    status: req.body.status
  });
  category
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Category created successfully",
        success: true,
        data:result,
        request: {
          type: "GET",
          url: process.env.SERVER_URL + "categories/" + result._id
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


exports.categories_get_by_id = (req, res, next) => {
  const id = req.params.categoryId;
  Category.findById(id)
    
    .exec()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).json({
          success: true,
          data: result,
          request: {
            type: "GET",
            url: process.env.SERVER_URL + "categories/"
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: "There is no valid entry found",            
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        details: err 
      });
    });
};

exports.categories_update_category = (req, res, next) => {
  const id = req.params.categoryId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Category.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        success: true,
        message: "Category updated successfully",       
        request: {
          type: "GET",
          url: process.env.SERVER_URL + "categories/" + id
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
};

exports.categories_delete_by_id = (req, res, next) => {
  
  Category.findById(req.params.categoryId)    
    .exec()
    .then(doc => {

      if (doc) {
        Category.deleteOne({ _id: req.params.categoryId })
        .exec()
        .then(result => {
         
          if (fs.existsSync(doc.categoryImage)) {
            fs.unlink(doc.categoryImage, function (err) {
              console.log('File deleted!');
            });
          }
          res.status(200).json({
            success: true,
            message: "Category deleted succesfully",
            request: {
              type: "POST",
              url: process.env.SERVER_URL + "categories/",
              body: { name: "String", description: "String", "..":".." }
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
      }else{
        res.status(500).json({ 
          error:true,
          message: "There is no valid entry found to delete",            
        });
      }
     
    }).catch(err =>{
      res.status(500).json({ 
        success: false,
        message: "Internal server error",
        error: err 
      });
    });

 
};