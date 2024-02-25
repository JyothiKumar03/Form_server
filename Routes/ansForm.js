const express = require("express");
const router = express.Router();
const QuestionForm = require("../models/questionForm");

router.get("/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await QuestionForm.findById(formId);
    console.log(form);

    if (form.accepting === false) {
      return res
        .status(302)
        .json({ message: "This Form is no longer accepting responses" });
    }

    return res.status(200).json({ message: "Delivering form", form });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { answers, formId } = req.body;
    const form = await QuestionForm.findById(formId);
    if (form.accepting === false) {
      return res
        .status(302)
        .json({ message: "This Form is no longer accepting responses" });
    }
    form.ansForms.push(answers);
    await form.save();
    res.status(201).json({ message: "Form Submitted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong" });
  }
});

module.exports = router;
