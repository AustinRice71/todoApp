import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, getGroup, updateGroup } from "../../api/groups";

/**
 * A modal dialog for creating or editing a group.
 */

/**
 * Props:
 * - open: whether the dialog is visible
 * - editId: if present, the ID of the group being edited
 * - onClose: callback when the dialog should be closed
 */
type Props = {
  open: boolean;
  editId?: number;
  onClose: () => void;
};

export default function GroupDialog({ open, editId, onClose }: Props) {
  if (!open) return null;

  // React Query client for invalidating queries after mutations.
  const queryClient = useQueryClient();
  const isEdit = editId !== undefined;

  // Fetch the existing group data when in edit mode. UseQuery is for read operations.
  const groupQuery = useQuery({
    queryKey: ["group", editId],
    queryFn: () => getGroup(editId as number),
    enabled: open && isEdit, // Only run this query when the modal is open and is in edit mode
  });

  // Local form state for the group name input. Default to empty string.
  const [name, setName] = useState("");

  // When we receive the group, prefill the input
  useEffect(() => {
    // If we're editing, set the name to the fetched group's name
    if (isEdit) {
      setName(groupQuery.data?.name ?? "");
    } else {
      setName("");
    }
  }, [isEdit, groupQuery.data?.name]); // Re-run when isEdit or fetched name changes.

  /**
   * Mutations are used for Create, Update, Delete (CUD) operations.
   */

  // Mutation for CREATE
  const createMutation = useMutation({
    // When you call createMutation.mutate, this function runs (createGroup(payload aka { name: string })).
    mutationFn: (payload: { name: string }) => createGroup(payload),
    onSuccess: () => {
      // Anything cached under the "groups" key is now stale, so we refetch it to get the new group included.
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
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onClose();
    },
    onError: (err) => {
      console.error("Update group failed:", err);
    },
  });

  // Variable to track if either mutation is in progress.
  const isBusy = createMutation.isPending || updateMutation.isPending;

  /**
   * Triggered when the user clicks "Save".
   */
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
          <button onClick={handleSave} disabled={isBusy || !name.trim()}>
            {isBusy ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
