const Intern = require("../lib/Intern");

test("Can set school via constructor", () =>{
    const testValue = "UCLA";
    const e = new Intern("Foo", 1, "test@test.com", testValue);
    expect(e.school).toBe(testValue);
});