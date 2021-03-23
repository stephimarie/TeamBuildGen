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
  
  const formatNumInput = async (number) => {
    return number.trim().replace(/^0+/, "").replace(" ", "");
  };
  
  const formatEmail = async (email) => {
    return email.trim();
  };
  
  const formatGithub = async (github) => {
    return github.trim();
  };
  
  // array of questions that the user will be asked so we can gather information about their employees
  const promptUser = () => {
    return inquirer.prompt([
      {
        type: "input",
        name: "empName",
        message: "Enter a employee's name:",
        validate: isString,
        filter: formatTitleCase,
      },
      {
        type: "input",
        name: "id",
        message: "Enter the employee's ID:",
        validate: isNumeric,
        filter: formatNumInput,
      },
      {
        type: "input",
        name: "email",
        message: "Enter the employee's email address:",
        validate: isString,
        filter: formatEmail,
      },
      {
        type: "list",
        name: "role",
        message: "Select the employee's role:",
        choices: ["Manager", "Engineer", "Intern"],
      },
      // Each employee 'role' (manager, engineer, or intern) has slightly different information, so we have to ask different questions depending on the employee 'role' selected.
      {
        type: "input",
        name: "officeNumber",
        message: "Enter the manager's office number:",
        when: (responses) => responses.role === "Manager",
        validate: isNumeric,
        filter: formatNumInput,
      },
      {
        type: "input",
        name: "github",
        message: "Enter the engineer's Github username:",
        when: (responses) => responses.role === "Engineer",
        validate: isString,
        filter: formatGithub,
      },
      {
        type: "input",
        name: "school",
        message: "Enter the intern's school:",
        when: (responses) => responses.role === "Intern",
        validate: isString,
        content: formatTitleCase,
      },
    ]);
  };
   // this will confirm with the user that the info we have recieved is correct
   const confirmManagerInfo = (responses) => {
    return inquirer.prompt({
      type: "list",
      name: "isCorrect",
      message:
        "Confirm that the information you provided for " +
        responses.empName +
        " is correct before we add them to your roster? \nRole: " +
        responses.role +
        "\nName: " +
        responses.empName +
        "\nId: " +
        responses.id +
        "\nEmail: " +
        responses.email +
        "\nOffice Number: " +
        responses.officeNumber +
        "\n",
      choices: ["Yes, that information is correct", "No, there's a typo"],
    });
  };
  // this will confirm with the user that the info we have recieved is correct
  const confirmEngineerInfo = (responses) => {
    return inquirer.prompt({
      type: "list",
      name: "isCorrect",
      message:
        "Confirm that the information you provided for " +
        responses.empName +
        " is correct before we add them to your roster? \nRole: " +
        responses.role +
        "\nName: " +
        responses.empName +
        "\nId: " +
        responses.id +
        "\nEmail: " +
        responses.email +
        "\nGithub Username: " +
        responses.github +
        "\n",
      choices: ["Yes, that information is correct", "No, there's a typo"],
    });
  };
  // this will confirm with the user that the info we have recieved is correct
  const confirmInternInfo = (responses) => {
    return inquirer.prompt({
      type: "list",
      name: "isCorrect",
      message:
        "Confirm that the information you provided for " +
        responses.empName +
        " is correct before we add them to your roster? \nRole: " +
        responses.role +
        "\nName: " +
        responses.empName +
        "\nId: " +
        responses.id +
        "\nEmail: " +
        responses.email +
        "\nSchool: " +
        responses.school +
        "\n",
      choices: ["Yes, that information is correct", "No, there's a typo"],
    });
  };
  // This Function will use inquirer to gather information about the team, create objects for each team member, and add them to the "employees" array using the respective "Manager", "Engineer", "Intern" classes
  const init = async () => {
    console.log(
      "Let's begin generating your team roster!\nCarefully answer all of the prompts below\n----------------------------------------------\n"
    );
    try {
      // gather the number of employees
      const answer = await inquirer.prompt([
        // prompt to get the total number of employees
        {
          type: "input",
          name: "numOfEmployees",
          message:
            "How many members are on your team? (don't forget to include yourself)",
          validate: isNumeric,
          filter: formatNumInput,
        },
      ]);
      while (employeesArray.length < answer.numOfEmployees) {
        // gather information about the development team members
        const responses = await promptUser();
  
        // Depending on the response, loop through questions to gather information and save to appropriate object
        if (responses.role === "Manager") {
          // Prompts to verify if info provided by the user is correct
          const managerResponses = await confirmManagerInfo(responses);
  
          if (managerResponses.isCorrect === "Yes, that information is correct") {
            // create a manager object using the Manager class
            const manager = new Manager(
              responses.empName,
              responses.id,
              responses.email,
              responses.officeNumber
            );
            // add manager object to the employeesArray
            employeesArray.push(manager);
            console.log(
              "Succesfully added " + responses.empName + " to your roster!"
            );
          } else {
            console.log("Go ahead and answer these prompts once again");
          }
        } else if (responses.role === "Engineer") {
          // Prompts to verify if info provided by the user is correct
          const engineerResponses = await confirmEngineerInfo(responses);
  
          if (
            engineerResponses.isCorrect === "Yes, that information is correct"
          ) {
            // create a engineer object using the Engineer class
            const engineer = new Engineer(
              responses.empName,
              responses.id,
              responses.email,
              responses.github
            );
            // add engineer object to the employeesArray
 