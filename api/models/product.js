const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,  
    
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },


    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String ,  default: null},
    price: { type: Number, required: true },
    offerPrice: { type: Number,  default: null },
    productImage: { type: String, required: true },   
    quantity:  { type: Number, default: 1 },
    status: {type: Number, default: 0},
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Product", productSchema);
