const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  questionForms: [
    {
      type: Schema.Types.ObjectId,
      ref: "QuestionForm",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
