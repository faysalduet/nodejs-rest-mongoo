const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    parentId: { type:Number, required:true, default:0 },
   
    name: { type: String, required: true },   
    description: { type: String ,  default: null},
    image: { type: String, default: null },   

    status: {type: Number, default: 0},
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Category", categorySchema);
