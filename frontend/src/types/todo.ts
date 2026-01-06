export type TodoPriority = "Low" | "Medium" | "High";

export type TodoItem = {
  id: number;
  groupId: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TodoPriority;
  completed: boolean;
};
