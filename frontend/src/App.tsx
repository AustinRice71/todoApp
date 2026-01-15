import { Routes, Route, Navigate } from "react-router-dom";
import GroupPage from "./pages/GroupPage";
import TodoFormPage from "./pages/TodoFormPage";

// App is the top-level router container.
// It decides which "page" component to show depending on the URL.
export default function App() {
  return (
    <Routes>
      // Main page showing groups and their todos
      <Route path="/" element={<GroupPage />} />
      // Page for creating a new todo.
      <Route path="/todos/new" element={<TodoFormPage mode="create" />} />
      // Page for editing an existing todo.
      <Route path="/todos/:id/edit" element={<TodoFormPage mode="edit" />} />
      // Redirect any unknown routes to the main page.
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
