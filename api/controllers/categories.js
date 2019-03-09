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
            image:result.image,
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
    image: req.file.path,   
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
  
  
  Category.findById(req.params.categoryId)    
  .exec()
  .then(doc => {
    if(doc){
      const updateOps = {   
        name: (req.body.name)? req.body.name: doc.name,
        description: (req.body.description)? req.body.description: doc.name ,
        parentId: (req.body.parentId)? req.body.parentId: doc.parentId ,
        image: (req.file.path)? req.file.path: doc.image , 
        status: (req.body.status)? req.body.status: doc.status,
        updateDate: Date.now
      };  
  
      Category.updateOne({ _id: req.params.categoryId }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log('File path!' + req.file.path);
        console.log('existing File path!' + doc.image);
        if ( req.file.path && fs.existsSync(doc.image)) {
          fs.unlink(doc.image, function (err) {
            console.log('File deleted!');
          });
        }
        res.status(200).json({
          message: "Category updated successfully",
          success: true,        
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
    }else{      
      res.status(404).json({
        success: false,
        message: "There is no valid entry found to update",                  
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

exports.categories_delete_by_id = (req, res, next) => {
  
  Category.findById(req.params.categoryId)    
    .exec()
    .then(doc => {

      if (doc) {
        Category.deleteOne({ _id: req.params.categoryId })
        .exec()
        .then(result => {
         
          if (fs.existsSync(doc.image)) {
            fs.unlink(doc.image, function (err) {
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
        res.status(404).json({ 
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