const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    
    name: { type: String, required: true },   
    description: { type: String ,  default: null},
    brandImage: { type: String, default: null },   

    status: {type: Number, default: 0},
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Brand", brandSchema);
