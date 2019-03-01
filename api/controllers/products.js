const mongoose = require("mongoose");
const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        products: result.map(result => {
          return {
            name: result.name,
            price: result.price,
            productImage: result.productImage,
            _id: result._id,
            request: {
              type: "GET",
              url: "http://127.0.0.1:3000/products/" + result._id
            }
          };
        })
      };

      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product created successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: "GET",
            url: process.env.SERVER_URL + "products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_get_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).json({
          product: result,
          request: {
            type: "GET",
            url: process.env.SERVER_URL + "products/"
          }
        });
      } else {
        res.status(404).json({
          message: "There is no valid entry found"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
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
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated successfully",
        request: {
          type: "GET",
          url: process.env.SERVER_URL + "products/" + id
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.products_delete_by_id = (req, res, next) => {
  Product.remove({ _id: req.params.productId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted succesfully",
        request: {
          type: "POST",
          url: process.env.SERVER_URL + "products/",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
