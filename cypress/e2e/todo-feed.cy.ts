const BASE_URL = "http://localhost:3000";
const TODO_CONTENT = "Test Todo";

describe("/ - Todos feed", () => {
  it("when load, renders the page", () => {
    cy.visit(BASE_URL);
  });
  it("when create a new todo, it must appears in the screen", () => {
    cy.intercept("POST", `${BASE_URL}/api/todos`, (request) => {
      request.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "b33004ba-e876-4165-9b5a-adea5b63d184",
            date: "2023-06-27T13:18:47.509Z",
            content: TODO_CONTENT,
            done: false,
          },
        },
      });
    }).as("createTodo");
    cy.visit(BASE_URL);
    cy.get("input[name='add-todo']").type(TODO_CONTENT);
    cy.get("[aria-label='Adicionar novo item']").click();
    cy.contains(TODO_CONTENT);
  });
});
