import type { TodoItem } from "../../types/todo";

type Props = {
  todo: TodoItem;

  onToggleComplete: (id: number, completed: boolean) => void;

  disabled?: boolean;
};

export default function TodoCard({ todo, onToggleComplete, disabled }: Props) {
  return (
    <div className={`todo-card ${todo.completed ? "completed" : ""}`}>
      <div className="todo-card-top">
        {/* Left side: checkbox + title */}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={todo.completed}
            disabled={disabled}
            onChange={(e) => {
              // nextCompleted is whatever the checkbox was changed to
              const nextCompleted = e.target.checked;

              // Tell parent: "update this todo’s completed state"
              onToggleComplete(todo.id, nextCompleted);
            }}
          />

          {/* Title: visually strike through if completed */}
          <strong style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            {todo.title}
          </strong>
        </label>

        {/* Priority badge */}
        <span className="badge">{todo.priority}</span>
      </div>

      {/* Optional description */}
      {todo.description ? <p className="muted">{todo.description}</p> : null}

      <div className="todo-card-bottom">
        {/* Due date */}
        <span className="muted">
          Due:{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "—"}
        </span>

        {/* Completed indicator */}
        <span className="muted">
          {todo.completed ? "✅ Completed" : "⬜ Not done"}
        </span>
      </div>
    </div>
  );
}
