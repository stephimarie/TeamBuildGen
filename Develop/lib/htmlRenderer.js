const path = require("path");
const fs = require("fs");

const templatesDir = path.resolve(__dirname, "../templates");

const render = employees => {
    const html = [];

    html.push(...employees
        .filter(employee => employee.getRole() === "Manager")
        .map(manager => renderManager(manager))
    );
    html.push(...employees)
}