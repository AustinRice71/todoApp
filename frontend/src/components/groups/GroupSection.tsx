import type { Group } from "../../types/group";
import type { TodoItem } from "../../types/todo";
import TodoCard from "../todos/TodoCard";

/**
 * Component to display a section for a specific group, including its todos
 * and actions to edit/delete the group.
 */

/**
 * Props:
 * - group: The group data to display.
 * - todos: List of todo items belonging to this group.
 * - onEditGroup: Callback when the edit button is clicked.
 * - onDeleteGroup: Callback when the delete button is clicked.
 * - onToggleTodoComplete: Callback when a todo's completed status is toggled.
 * - savingTodo: Optional flag indicating if a todo is currently being saved.
 */
type Props = {
  group: Group;
  todos: TodoItem[];
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onToggleTodoComplete: (id: number, nextCompleted: boolean) => void;
  savingTodo?: boolean;
};

export default function GroupSection({
  group,
  todos,
  onEditGroup,
  onDeleteGroup,
  onToggleTodoComplete,
  savingTodo
}: Props) {
  
  return (
    <section className="group-section">
      <div className="group-header">
        <h2>{group.name}</h2>

        <div className="group-actions">
          <button onClick={onEditGroup}>Edit</button>
          <button onClick={onDeleteGroup}>Delete</button>
        </div>
      </div>

      {/* Show a message if there are no todos in this group */}
      {todos.length === 0 ? (
        <div className="empty">No todos in this group.</div>
      ) : (
        <div className="todo-grid">
          {todos.map((t) => (
            <TodoCard 
              key={t.id}
              todo={t}
              onToggleComplete={onToggleTodoComplete}
              disabled={savingTodo} />
          ))}
        </div>
      )}
    </section>
  );
}
