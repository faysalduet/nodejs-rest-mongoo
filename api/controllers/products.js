const mongoose = require("mongoose");
const Product = require("../models/product");
const slugify = require('slugify');
var fs = require('fs');


exports.products_get_all = (req, res, next) => {
  Product.find() 
    .select("category brand user _id  name slug description price offerPrice productImage status  updatedDate createdDate ")
    .populate("category", "_id name")
    .populate("brand", "_id name")
    .populate("user", "_id email firstname lastname")
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        message: "Get all product",
        success: true,
        data: result.map(result => {
          return {           
            _id:result._id,
            name:result.name,
            slug:result.slug,
            description:result.description,
            price:result.price,
            offerPrice:result.offerPrice,          
            category:result.category,
            brand:result.brand,
            productImage:result.productImage,
            status:result.status,
            user:result.user,
            updateDate:result.updatedDate,
            createdDate:result.createdDate,
            request: {
              type: "GET",
              url: process.env.SERVER_URL+"products/" + result._id
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

exports.products_create_product = (req, res, next) => {
  console.log(req.file);

  let slug = (req.body.slug)? req.body.slug: slugify(req.body.name);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    offerPrice: req.body.offerPrice,
    description: req.body.description,
    category: req.body.categoryId,
    brand: req.body.brandId,
    user: req.body.userId,
    productImage: req.file.path,
    slug: slug,
    status:req.body.status,
    quantity:req.body.quantity
    
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product created successfully",
        success: true,
        data:result,
        request: {
          type: "GET",
          url: process.env.SERVER_URL + "products/" + result._id
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

exports.products_get_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("category brand user _id  name slug description price offerPrice productImage status  updatedDate createdDate ")
    .populate("category", "_id name")
    .populate("brand", "_id name")
    .populate("user", "_id email firstname lastname")
    .exec()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).json({
          success: true,
          data: result,
          request: {
            type: "GET",
            url: process.env.SERVER_URL + "products/"
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
        error: err 
      });
    });
};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        success: true,
        message: "Product updated successfully",       
        request: {
          type: "GET",
          url: process.env.SERVER_URL + "products/" + id
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

exports.products_delete_by_id = (req, res, next) => {
    
  Product.findById(req.params.productId)    
    .exec()
    .then(doc => {
      if (doc) {        
        Product.deleteOne({ _id: req.params.productId })
        .exec()
        .then(result => {
          if (fs.existsSync(doc.productImage)) {
            fs.unlink(doc.productImage, function (err) {
              console.log('File deleted!');
            });
          }
         
          res.status(200).json({
            success: true,
            message: "Product deleted succesfully",
            request: {
              type: "POST",
              url: process.env.SERVER_URL + "products/",
              body: { name: "String", price: "Number", "..":".." }
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
          success: false,
          message: "There is no valid entry found to delete",   
           
        });
      }
    }).catch(err => {
      res.status(500).json({ 
        success: false,
        message: "Internal server error",
        error: err 
      });
    });

    
};
