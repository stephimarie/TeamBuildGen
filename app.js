const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const writeFileAsync = util.promisify(fs.writeFile);

// declare employees array that will hold all team members
const employeesArray = [];

// Functions to validate user input;
// This validates that the user's input is a non-negative number
const isNumeric = async (input) => {
    const int = parseInt(input.trim());
  
    if (typeof int !== "number" || isNaN(int) || int <= 0) {
      // invalid input
      return "Invalid Input: Your input should be a non-negative number";
    }
    // valid input
    return true;
  };
  
  // This validates that the user's input is a non-empty string
  const isString = async (input) => {
    if (typeof input !== "string" || !input.trim().length || parseInt(input)) {
      // input is not a string or is empty
      return "Invalid Input: Your input should be a non-empty string";
    }
    // valid input
    return true;
  };
  
  // This formats the input given by the user
  const formatTitleCase = async (string) => {
    return string
      .split(" ")
      .map((word) => {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
      })
      .join(" ")
      .trim();
  };
  
