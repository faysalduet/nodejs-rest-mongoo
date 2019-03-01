const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id,
            request: {
              type: "GET",
              url: process.env.SERVER_URL + "orders/" + doc._id
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

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      // console.log(product);
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });

      return order.save();
    })

    .then(doc => {
      console.log(doc);
      res.status(201).json({
        message: "Order created successfully",
        createdOrder: {
          productId: doc.product,
          quantity: doc.quantity,
          _id: doc._id,
          request: {
            type: "GET",
            url: process.env.SERVER_URL + "orders/" + doc._id
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

exports.orders_get_by_id = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).json({
          order: result,
          request: {
            type: "GET",
            url: process.env.SERVER_URL + "orders/"
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

exports.orders_delete_by_id = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted succesfully",
        request: {
          type: "POST",
          url: process.env.SERVER_URL + "order/",
          body: { productId: "String", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};
