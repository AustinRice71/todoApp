using System.ComponentModel.DataAnnotations.Schema;
using Todo.Domain.Enums;

namespace Todo.Domain;

/// <summary>
/// Represents a TodoItem entity 
/// </summary>
public class TodoItem
{
    /// <summary>
    /// Gets or sets the primary key identifier for the todo item.
    /// </summary>
    public int Id { get; set; }

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
    public bool Completed { get; set; }

    /// <summary>
    /// Gets or sets the due date of the TodoItem.
    /// </summary>
    public DateTime DueDate { get; set; }

    /// <summary>
    /// Gets or sets the priority level of the TodoItem.
    /// </summary>
    public TodoPriority Priority { get; set; } = TodoPriority.Medium;

    /// <summary>
    /// Gets or sets the foreign key identifier for the associated Todo group.
    /// </summary>
    public int GroupId { get; set; }

    /// <summary>
    /// Gets or sets the Todo group associated with the TodoItem.
    /// </summary>
    [ForeignKey(nameof(GroupId))]
    public Group Group { get; set; }

    /// <summary>
    /// Gets or sets the creation date of the TodoItem.
    /// </summary>
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the last updated date of the TodoItem.
    /// </summary>
    public DateTime? UpdatedDate { get; set; }
}