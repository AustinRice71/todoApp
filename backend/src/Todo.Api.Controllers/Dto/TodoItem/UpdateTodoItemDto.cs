using Todo.Domain.Enums;

namespace Todo.Api.Controllers.Dto.TodoItem;

/// <summary>
/// Dto for updating a TodoItem entity.
/// Represents the data structure sent from clients when updating an existing TodoItem.
/// </summary>
public class UpdateTodoItemDto
{
    /// <summary>
    /// Gets or sets the TodoItem task.
    /// </summary>
    public string Title { get; set; } = "";

    /// <summary>
    /// Gets or sets the details of the TodoItem.
    /// </summary>
    public string Description { get; set; } = "";

    /// <summary>
    /// Gets or sets the due date of the TodoItem.
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