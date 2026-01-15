import { api } from "./client";
import type { TodoItem, TodoPriority } from "../types/todo";

/**
 * This file contains API functions related to todo items. These functions interact
 * with the backend to perform CRUD operations on todo data.
 */

// Define the shape of the query parameters for fetching todos
export type TodosQuery = {
  priority?: TodoPriority | "All";
  showCompleted?: boolean;
  order?: "asc" | "desc";
};

/**
 * Fetches the list of todo items from the API.
 * @returns A list of TodoItem objects.
 */
export async function getTodos(): Promise<TodoItem[]> {
  const res = await api.get("/todoitems");
  return res.data;
}

/**
 * Fetch a single todo item by ID.
 * @param id 
 * @returns A TodoItem object.
 */
export async function getTodo(id: number): Promise<TodoItem> {
  const res = await api.get(`/todoitems/${id}`);
  return res.data;
}

/**
 * Create a new todo item.
 * @param payload 
 * @returns The created TodoItem object.
 */
export async function createTodo(payload: Omit<TodoItem, "id">): Promise<TodoItem> {
  const res = await api.post("/todoitems", payload);
  return res.data;
}

/**
 * Update an existing todo item.
 * @param id 
 * @param payload 
 */
export async function updateTodo(id: number, payload: Omit<TodoItem, "id">): Promise<void> {
  await api.put(`/todoitems/${id}`, payload);
}

/**
 * Toggle the completed status of a todo item.
 * @param id 
 * @param completed 
 */
export async function toggleCompleteTodo(id: number, completed: boolean): Promise<void> {
  await api.patch(`/todoitems/${id}/togglecomplete`, { isCompleted: completed });
}

/**
 * Delete a todo item by ID.
 * @param id 
 */
export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todoitems/${id}`);
}

/**
 * Set the completed status of a todo item.
 * @param id 
 * @param isCompleted 
 */
export async function setTodoCompleted(id: number, isCompleted: boolean): Promise<void> {
  await api.patch(`/todoitems/${id}/complete`, { isCompleted });
}
