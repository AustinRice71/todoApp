using System.ComponentModel.DataAnnotations;
using Todo.Domain.Enums;

namespace Todo.Api.Controllers.Dto.TodoItem;

/// <summary>
/// Dto for creating a TodoItem entity.
/// Represents the data structure sent from clients when creating a new TodoItem.
/// </summary>
public class CreateTodoItemDto
{
    /// <summary>
    /// Gets or sets the TodoItem task.
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = "";

    /// <summary>
    /// Gets or sets the details of the TodoItem.
    /// </summary>
    [MaxLength(2000)]
    public string Description { get; set; } = "";

    /// <summary>
    /// Gets or sets the due date of the TodoItem.
    /// </summary>
    public DateTime DueDate { get; set; }

    /// <summary>
    /// Gets or sets the priority level of the TodoItem.
    /// </summary>
    [Range((int)TodoPriority.Low, (int)TodoPriority.High)]
    public TodoPriority Priority { get; set; }

    /// <summary>
    /// Gets or sets the foreign key identifier for the associated Todo group.
    /// </summary>
    [Required]
    public int GroupId { get; set; }
}