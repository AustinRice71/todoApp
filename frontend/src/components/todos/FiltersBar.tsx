import type { TodoPriority } from "../../types/todo";

type Props = {
  // current UI values
  priority: "All" | TodoPriority;
  showCompleted: boolean;
  order: "asc" | "desc";

  // callbacks for when user changes them
  onChangePriority: (value: "All" | TodoPriority) => void;
  onChangeShowCompleted: (value: boolean) => void;
  onChangeOrder: (value: "asc" | "desc") => void;
};

export default function FiltersBar(props: Props) {
  const {
    priority,
    showCompleted,
    order,
    onChangePriority,
    onChangeShowCompleted,
    onChangeOrder,
  } = props;

  return (
    <div className="filters">
      <label>
        Priority:&nbsp;
        <select
          value={priority}
          // event.target.value is always a string, so we cast to our union type
          onChange={(e) =>
            onChangePriority(e.target.value as Props["priority"])
          }
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      <label style={{ marginLeft: 12 }}>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(e) => onChangeShowCompleted(e.target.checked)}
        />
        &nbsp;Show completed
      </label>

      <label style={{ marginLeft: 12 }}>
        Sort:&nbsp;
        <select
          value={order}
          onChange={(e) => onChangeOrder(e.target.value as Props["order"])}
        >
          <option value="asc">Due date ↑</option>
          <option value="desc">Due date ↓</option>
        </select>
      </label>
    </div>
  );
}
