type TodoFormMode = "create" | "edit";

type TodoFormPageProps = {
  mode: TodoFormMode;
};

export default function TodoFormPage({ mode }: TodoFormPageProps) {
  return (
    <div>
      <h1>{mode === "create" ? "Create Todo" : "Edit Todo"}</h1>
    </div>
  );
}
