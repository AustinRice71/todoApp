import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGroups, deleteGroup } from "../api/groups";
import { getTodos, toggleCompleteTodo } from "../api/todos";
import FiltersBar from "../components/todos/FiltersBar";
import GroupSection from "../components/groups/GroupSection";
import GroupDialog from "../components/groups/GroupDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useNavigate } from "react-router-dom";

export default function GroupPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const groupsQuery = useQuery({ queryKey: ["groups"], queryFn: getGroups });
  const todosQuery = useQuery({ queryKey: ["todos"], queryFn: getTodos });

  /**
   * Mutations
   */

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: (id: number) => deleteGroup(id),
    onSuccess: async () => {
      // refresh groups list
      await queryClient.invalidateQueries({ queryKey: ["groups"] });

      // if deleting a group also deletes its todos, refresh todos too
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Toggle todo completed mutation
  const toggleTodoCompleteMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      toggleCompleteTodo(id, completed),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Set the possible choices for priority.
  const [priority, setPriority] = useState<"All" | "Low" | "Medium" | "High">(
    "All"
  );

  // Set whether to show completed todos.
  const [showCompleted, setShowCompleted] = useState(false);

  // Set the sort order.
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [groupDialog, setGroupDialog] = useState<{
    open: boolean;
    editId?: number;
  }>({ open: false });

  // Set up confirmation dialog state
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    onYes?: () => void;
  }>({
    open: false,
    title: "",
  });

  // Data for groups and todos.
  const groups = groupsQuery.data ?? [];
  const todos = todosQuery.data ?? [];

  // Apply filters and sorting to todos.
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (!showCompleted) result = result.filter((t) => !t.completed);
    if (priority !== "All")
      result = result.filter((t) => t.priority === priority);

    result.sort((a, b) => {
      const ad = a.dueDate
        ? new Date(a.dueDate).getTime()
        : Number.POSITIVE_INFINITY;
      const bd = b.dueDate
        ? new Date(b.dueDate).getTime()
        : Number.POSITIVE_INFINITY;
      return order === "asc" ? ad - bd : bd - ad;
    });

    return result;
  }, [todos, showCompleted, priority, order]);

  // Group todos by their groupId.
  const todosByGroup = useMemo(() => {
    const map = new Map<number, typeof filteredTodos>();
    for (const t of filteredTodos) {
      const arr = map.get(t.groupId) ?? [];
      arr.push(t);
      map.set(t.groupId, arr);
    }
    return map;
  }, [filteredTodos]);

  return (
    <div className="page">
      <h1>TODO List</h1>

      <FiltersBar
        priority={priority}
        showCompleted={showCompleted}
        order={order}
        onChangePriority={setPriority}
        onChangeShowCompleted={setShowCompleted}
        onChangeOrder={setOrder}
      />

      <div className="toolbar">
        <button onClick={() => setGroupDialog({ open: true })}>
          Add Group
        </button>
      </div>

      {groups.map((g) => (
        <GroupSection
          key={g.id}
          group={g}
          todos={todosByGroup.get(g.id) ?? []}
          onEditGroup={() => setGroupDialog({ open: true, editId: g.id })}
          onDeleteGroup={() =>
            setConfirm({
              open: true,
              title: `Delete group "${g.name}"? This may also delete its todos.`,
              onYes: () => deleteGroupMutation.mutate(g.id),
            })}
          onToggleTodoComplete={(id, nextCompleted) =>
            toggleTodoCompleteMutation.mutate({ id, completed: nextCompleted })}
          savingTodo={toggleTodoCompleteMutation.isPending}
        />
      ))}

      <button className="fab" onClick={() => navigate("/todos/new")}>
        +
      </button>

      {
        <GroupDialog
          open={groupDialog.open}
          editId={groupDialog.editId}
          onClose={() => setGroupDialog({ open: false })}
        />
      }

      {
        <ConfirmDialog
          open={confirm.open}
          title={confirm.title}
          onNo={() => setConfirm({ open: false, title: "" })}
          onYes={() => {
            confirm.onYes?.();
            setConfirm({ open: false, title: "" });
          }}
        />
      }
    </div>
  );
}
