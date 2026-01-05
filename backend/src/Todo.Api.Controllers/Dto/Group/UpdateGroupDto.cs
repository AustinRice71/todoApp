using System.Collections.Generic;
using Todo.Api.Controllers.Dto.TodoItem;

namespace Todo.Api.Controllers.Dto.Group;

/// <summary>
/// This DTO is used for updating an existing Group. 
/// Represents the data structure sent from clients when updating a Group.
/// </summary>
public class UpdateGroupDto
{
    /// <summary>
    /// Gets or sets the name of the Group.
    /// </summary>
    public string Name { get; set; } = "";
}