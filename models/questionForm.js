const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionForm = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  accepting: {
    type: Boolean,
    required: true,
    default: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  questions: [
    {
      question: {
        type: String,
      },
      type: {
        type: String,
      },
      required: {
        type: Boolean,
      },
      options: [
        {
          type: String,
        },
      ],
    },
  ],
  ansForms: [[{}]],
});

module.exports = mongoose.model("QuestionForm", QuestionForm);
