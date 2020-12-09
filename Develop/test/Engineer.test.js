const Engineer = require("../lib/Engineer");

test("Can set GitHub account via constructor", () => {
    const testValue = "GitHubUser";
    const e = new Engineer("Foo",1, "test@test.com", testValue);
    expect(e.github).toBe(testValue);
});

