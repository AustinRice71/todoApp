import { api } from "./client";
import type { Group } from "../types/group";

// Fetch all groups.
export async function getGroups(): Promise<Group[]> {
  const res = await api.get("/api/groups");
  return res.data;
}

export async function createGroup(payload: { name: string }): Promise<Group> {
  const res = await api.post("/api/groups", payload);
  return res.data;
}

export async function updateGroup(
  id: number,
  payload: { name: string }
): Promise<void> {
  await api.put(`/api/groups/${id}`, payload);
}

export async function deleteGroup(id: number): Promise<void> {
  await api.delete(`/api/groups/${id}`);
}
