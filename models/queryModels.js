const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  testCaseId: Number,
  input: Array,
  query: String,
  expectedOutput: Array,
  description: String,
});

const TestCase = mongoose.model("TestCase", testCaseSchema);
module.exports = TestCase;
