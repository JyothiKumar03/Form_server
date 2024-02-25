const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const QuestionForm = require("../models/questionForm");
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { id, name, email } = req.user;
    const form = new QuestionForm(req.body);

    const user = await User.findById(id);

    user.questionForms.push(form);

    form.save();
    user.save();

    return res.status(200).json({ message: "Got Form" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.post("/formStatus/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await QuestionForm.findById(formId);
    form.accepting = !form.accepting;

    await form.save();
    return res.status(200).json({ message: "Toggled Status" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.get("/forms", async (req, res) => {
  try {
    console.log("getting forms");
    const { id } = req.user;
    console.log("req.user", req.user);
    const user = await User.findById(id).populate("questionForms");
    console.log(user);
    const forms = user.questionForms;

    return res.status(200).json({ message: "Returned Forms", forms });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.get("/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await QuestionForm.findById(formId);

    return res.status(200).json({ message: "Got form Successfully", form });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

router.delete("/:formId", async (req, res) => {
  try {
    const { id } = req.user;
    const { formId } = req.params;

    const user = await User.findById(id);
    user.questionForms.filter((form) => form._id !== formId);
    await user.save();
    await QuestionForm.findByIdAndDelete(formId);

    return res.status(200).json({ message: "Form Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;
