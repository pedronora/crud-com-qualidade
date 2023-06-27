import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControllerGetParams {
  page: number;
}
async function get(params: TodoControllerGetParams) {
  // Fazer a lógica de pegar os dados
  return todoRepository.get({
    page: params.page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Array<Todo> {
  const homeTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });

  return homeTodos;
}

interface TodoControllerCreateParams {
  content: string;
  onSuccess: (todo: Todo) => void;
  onError: (customMessage?: string) => void;
}

function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  const parsedPrams = schema.string().nonempty().safeParse(content);
  if (!parsedPrams.success) {
    onError();
    return;
  }

  todoRepository
    .createByContent(content)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError("Você precisa prover um conteúdo!");
    });
}

interface TodoControllerToggleDoneParams {
  id: string;
  updateTodoOnScreen: () => void;
  onError: () => void;
}
function toggleDone({
  id,
  updateTodoOnScreen,
  onError,
}: TodoControllerToggleDoneParams) {
  todoRepository
    .toggleDone(id)
    .then(() => {
      // Update Real
      updateTodoOnScreen();
    })
    .catch(() => {
      onError();
    });
}

async function deleteById(id: string): Promise<void> {
  await todoRepository.deleteById(id);
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
  deleteById,
};
