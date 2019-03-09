const mongoose = require("mongoose");
const Product = require("../models/product");
const slugify = require('slugify');
var fs = require('fs');


exports.products_get_all = (req, res, next) => {
  Product.find() 
    .select("category brand user _id  name slug description price offerPrice image status  updatedDate createdDate ")
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
            image:result.image,
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
    image: req.file.path,
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
    .select("category brand user _id  name slug description price offerPrice image status  updatedDate createdDate ")
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

  Product.findById(id).exec().then(doc => {
    if(doc){      

      console.log(doc);
      const updateOps = {  
        name: (req.body.name)? req.body.name: doc.name,
        price: (req.body.price)? req.body.price: doc.price,
        offerPrice: (req.body.offerPrice)?req.body.offerPrice: doc.offerPrice,
        description: (req.body.description)? req.body.description: doc.name ,
        category: (req.body.categoryId)?req.body.categoryId: doc.categoryId ,
        brand: (req.body.brandId)?req.body.brandId: doc.brandId ,
        user: (req.body.userId)?req.body.userId: doc.userId ,
        image: (req.file.path)? req.file.path: doc.image , 
        slug: (req.body.slug)?req.body.slug: doc.slug ,
        status: (req.body.status)? req.body.status: doc.status,
        quantity:(req.body.quantity)? req.body.quantity: doc.quantity
      };

      
      Product.updateOne({ _id: id }, { $set: updateOps })
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
          message: "Product updated successfully",
          success: true,        
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

    }else{
      res.status(404).json({
        success: false,
        message: "There is no valid entry found to update",                  
      });
    }

  }).catch(err => {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err 
    });
  });

};

exports.products_delete_by_id = (req, res, next) => {
    
  const id = req.params.productId;
  Product.findById(id)    
    .exec()
    .then(doc => {
      if (doc) {        
        Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
          if (fs.existsSync(doc.image)) {
            fs.unlink(doc.image, function (err) {
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
