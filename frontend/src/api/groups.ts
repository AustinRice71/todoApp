import { api } from "./client";
import type { Group } from "../types/group";

/**
 * Fetch all groups.
 * @returns A list of all groups.
 */
export async function getGroups(): Promise<Group[]> {
  const res = await api.get("/groups");
  return res.data;
}

/**
 * Fetch a single group by ID.
 * @param id
 * @returns The group with the specified ID.
 */
export async function getGroup(id: number): Promise<Group> {
  const res = await api.get(`/groups/${id}`);
  return res.data;
}

/**
 * Create a new group.
 * @param payload
 * @returns The created group.
 */
export async function createGroup(payload: { name: string }): Promise<Group> {
  const res = await api.post("/groups", payload);
  return res.data;
}

/**
 * Update an existing group.
 * @param id
 * @param payload The updated group data
 */
export async function updateGroup(
  id: number,
  payload: { name: string }
): Promise<void> {
  await api.put(`/groups/${id}`, payload);
}

/**
 * Delete a group by ID.
 * @param id
 */
export async function deleteGroup(id: number): Promise<void> {
  await api.delete(`/groups/${id}`);
}
