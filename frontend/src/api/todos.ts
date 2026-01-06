import { api } from "./client";
import type { TodoItem, TodoPriority } from "../types/todo";

export type TodosQuery = {
  priority?: TodoPriority | "All";
  showCompleted?: boolean;
  order?: "asc" | "desc";
};

// Fetch all todos.
export async function getTodos(): Promise<TodoItem[]> {
  const res = await api.get("/api/todos");
  return res.data;
}

export async function getTodo(id: number): Promise<TodoItem> {
  const res = await api.get(`/api/todos/${id}`);
  return res.data;
}

export async function createTodo(payload: Omit<TodoItem, "id">): Promise<TodoItem> {
  const res = await api.post("/api/todos", payload);
  return res.data;
}

export async function updateTodo(id: number, payload: Omit<TodoItem, "id">): Promise<void> {
  await api.put(`/api/todos/${id}`, payload);
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/api/todos/${id}`);
}

export async function setTodoCompleted(id: number, isCompleted: boolean): Promise<void> {
  await api.patch(`/api/todos/${id}/complete`, { isCompleted });
}
