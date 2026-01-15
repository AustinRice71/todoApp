import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, getGroup, updateGroup } from "../../api/groups";

type Props = {
  open: boolean;
  editId?: number; // if present, we are editing an existing group
  onClose: () => void;
};

export default function GroupDialog({ open, editId, onClose }: Props) {
  if (!open) return null;

  const queryClient = useQueryClient();
  const isEdit = editId !== undefined;

  const groupQuery = useQuery({
    queryKey: ["group", editId],
    queryFn: () => getGroup(editId as number),
    enabled: open && isEdit, // Only run this query when the modal is open and is in edit mode
  });

  // Local form state for the group name input
  const [name, setName] = useState("");

  // When we receive the group, prefill the input
  useEffect(() => {
    if (isEdit) {
      setName(groupQuery.data?.name ?? "");
    } else {
      setName("");
    }
  }, [isEdit, groupQuery.data?.name]);

  // Mutation for CREATE
  const createMutation = useMutation({
    mutationFn: (payload: { name: string }) => createGroup(payload),
    onSuccess: () => {
      // After creating, refresh the groups list so the UI updates
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onClose();
    },
    onError: (err) => {
      console.error("Create group failed:", err);
    },
  });

  // Mutation for UPDATE
  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: { name: string } }) =>
      updateGroup(vars.id, vars.payload),
    onSuccess: () => {
      // After updating, refresh the groups list so the UI updates
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onClose();
    },
    onError: (err) => {
      console.error("Update group failed:", err);
    },
  });

  const isBusy = createMutation.isPending || updateMutation.isPending;

  function handleSave() {
    // Basic validation so you don't send empty names
    const trimmed = name.trim();
    if (!trimmed) return;

    if (isEdit && editId !== undefined) {
      // Update existing group
      updateMutation.mutate({ id: editId, payload: { name: trimmed } });
    } else {
      // Create new group
      createMutation.mutate({ name: trimmed });
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{isEdit ? `Edit Group (#${editId})` : "Create Group"}</h3>

        {/* Placeholder input (we’ll wire form state + mutations next) */}
        <label>
          Name:
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group Name..."
            disabled={isBusy}
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose} disabled={isBusy}>
            Close
          </button>

          {/* Placeholder save button */}
          <button onClick={handleSave} disabled={isBusy || !name.trim()}>
            {isBusy ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
