using System.Dynamic;

namespace Todo.Domain;

public class Group
{
    /// <summary>
    /// Gets or sets the primary key identifier for the todo list.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the todo list.
    /// </summary>
    public string Name { get; set; } = "";

    /// <summary>
    /// Gets or sets the collection of TodoItems associated with the TodoList.
    /// </summary>
    public List<TodoItem> Items { get; set; } = new();

    /// <summary>
    /// Gets or sets the creation date of the Group.
    /// </summary>
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the last updated date of the Group.
    /// </summary>
    public DateTime? UpdatedDate { get; set; }
}