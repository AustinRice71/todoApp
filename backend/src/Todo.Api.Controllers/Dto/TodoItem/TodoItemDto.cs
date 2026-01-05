using Todo.Domain.Enums;

namespace Todo.Api.Controllers.Dto.TodoItem;

/// <summary>
/// Dto for TodoItem entity. 
/// Represents the data structure sent to clients.
/// </summary>
public class TodoItemDto
{
    /// <summary>
    /// Gets or sets the primary key identifier for the TodoItem.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the foreign key identifier for the associated Todo group.
    /// </summary>
    public int GroupId { get; set; }

    /// <summary>
    /// Gets or sets the TodoItem task.
    /// </summary>
    public string Title { get; set; } = "";

    /// <summary>
    /// Gets or sets the details of the TodoItem.
    /// </summary>
    public string Description { get; set; } = "";

    /// <summary>
    /// Gets or sets a value indicating if the TodoItem has been completed or not.
    /// </summary>
    public DateTime DueDate { get; set; }

    /// <summary>
    /// Gets or sets the priority level of the TodoItem.
    /// </summary>
    public TodoPriority Priority { get; set; }

    /// <summary>
    /// Gets or sets a value indicating if the TodoItem has been completed or not.
    /// </summary>
    public bool Completed { get; set; }
}