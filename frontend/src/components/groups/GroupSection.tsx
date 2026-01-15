import type { Group } from "../../types/group";
import type { TodoItem } from "../../types/todo";
import TodoCard from "../todos/TodoCard";

type Props = {
  group: Group;
  todos: TodoItem[];
  onEditGroup: () => void;
  onDeleteGroup: () => void;
};

export default function GroupSection({
  group,
  todos,
  onEditGroup,
  onDeleteGroup,
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
            <TodoCard key={t.id} todo={t} />
          ))}
        </div>
      )}
    </section>
  );
}
