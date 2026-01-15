import type { TodoItem } from "../../types/todo";

type Props = {
  todo: TodoItem;
};

export default function TodoCard({ todo }: Props) {
  return (
    <div className="todo-card">
      <div className="todo-card-top">
        {/* Title */}
        <strong>{todo.title}</strong>

        {/* Priority badge */}
        <span className="badge">{todo.priority}</span>
      </div>

      {/* Optional description */}
      {todo.description ? <p className="muted">{todo.description}</p> : null}

      <div className="todo-card-bottom">
        {/* Due date */}
        <span className="muted">
          Due:{" "}
          {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "—"}
        </span>

        {/* Completed indicator */}
        <span className="muted">
          {todo.completed ? "✅ Completed" : "⬜ Not done"}
        </span>
      </div>
    </div>
  );
}
