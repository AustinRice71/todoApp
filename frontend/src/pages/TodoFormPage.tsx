import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGroups } from "../api/groups";
import { createTodo, getTodo, updateTodo } from "../api/todos";
import type { TodoPriority } from "../types/todo";

// Props for the TodoFormPage component. Dictates whether we're creating or editing a todo.
type TodoFormMode = "create" | "edit";
type TodoFormPageProps = {
  mode: TodoFormMode;
};

export default function TodoFormPage({ mode }: TodoFormPageProps) {

  const navigate = useNavigate();
  const params = useParams();

  // Get the Id in the event we're in edit mode.
  const todoId = params.id ? Number(params.id) : undefined;

  const queryClient = useQueryClient();

  // Fetch groups for the group selection dropdown
  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  // In edit mode, we want to fetch the existing todo item data and prefill the form.
  const todoQuery = useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => getTodo(todoId!),
    enabled: mode === "edit" && todoId !== undefined,
  });

  /**
   * Form state. Set up state variables for each form field.
   */
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<TodoPriority>("Medium");
  const [groupId, setGroupId] = useState<number | "">("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // When editing once we have the todo data, prefill the form fields.
  useEffect(() => {
    if (mode !== "edit") return;
    if(!todoQuery.data) return;

    const TodoData = todoQuery.data;

    setTitle(TodoData.title ?? "");
    setDueDate(TodoData.dueDate ? TodoData.dueDate.slice(0, 10) : "");
    setPriority(TodoData.priority ?? "Medium");
    setGroupId(TodoData.groupId ?? "");
    setIsCompleted(TodoData.completed);

  }, [mode, todoQuery.data]);

  // Set default group when creating a new todo
  useEffect(() => {
    if (mode !== "create") return;

    const groups = groupsQuery.data ?? [];
    if(groups.length === 0) return;

    setGroupId(groups[0].id);
  }, [mode, groupsQuery.data]);


  /**
   * Mutations for creating and updating todos
   */
  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {

      // Refresh the todo list after creating a new todo.
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate("/"); // Navigate back to the todo list page.
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: (payload: { id: number; data: any }) =>
      updateTodo(payload.id, payload.data),
    onSuccess: async () => {
      // Refresh the todo list after updating a todo. Also refresh the specific todo item query.
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
      if(todoId){
        await queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
      }
      navigate("/");
    },
  });

  // Determine if either mutation is in progress
  const isSaving = createTodoMutation.isPending || updateTodoMutation.isPending;

  // Variable to determine if we can save form.
  const canSave = useMemo(() => {
    return title.trim().length > 0 && groupId !== null && !isSaving;
  }, [title, groupId, isSaving]);

  // Handle form submission
  function onSubmit() {
    if(!canSave) return;

    // Ensure a group is selected.
    if(groupId === ""){
      alert("Please select a group for the todo item.");
      return;
    }

    // Build payload
    const payload = {
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      priority,
      groupId: groupId!,
      completed: isCompleted,
    };

    if(mode === "create"){
      createTodoMutation.mutate(payload);
    } else {
      if(!todoId) return;

      updateTodoMutation.mutate({ id: todoId, data: payload });
    }
  }

   // Helpful combined error text
  const errorText =
    (groupsQuery.error as any)?.message ||
    (todoQuery.error as any)?.message ||
    (createTodoMutation.error as any)?.message ||
    (updateTodoMutation.error as any)?.message;

  return (
    <div className="page">
      <h1>{mode === "create" ? "Create Todo" : "Edit Todo"}</h1>

      {/* Loading state for edit mode */}
      {mode === "edit" && todoQuery.isLoading && <p>Loading todo...</p>}

      {/* Error state */}
      {errorText && (
        <p style={{ color: "crimson" }}>
          Error: {String(errorText)}
        </p>
      )}

      {/* Form */}
      <div className="card">
        <label style={{ display: "block", marginBottom: 12 }}>
          Title
          <input
            style={{ display: "block", width: "100%" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Buy groceries"
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Group
          <select
            style={{ display: "block", width: "100%" }}
            value={groupId}
          onChange={(e) => { 
              setGroupId(e.target.value === "" ? "" : Number(e.target.value))
            }}
            disabled={groupsQuery.isLoading || (groupsQuery.data ?? []).length === 0}
          >
            {(groupsQuery.data ?? []).length === 0 ? (
              <option value="">No groups yet — create one first</option>
            ) : (
              (groupsQuery.data ?? []).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))
            )}
          </select>
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Priority
          <select
            style={{ display: "block", width: "100%" }}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TodoPriority)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Due date
          <input
            style={{ display: "block", width: "100%" }}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          Completed
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate(-1)}>Cancel</button>

          <button onClick={onSubmit} disabled={!canSave || isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* tiny helper message */}
        {!canSave && (
          <p style={{ marginTop: 10, opacity: 0.7 }}>
            Title and group are required.
          </p>
        )}
      </div>
    </div>
  );
}
