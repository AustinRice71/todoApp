
namespace Todo.Api.Controllers.Dto.Group;

/// <summary>
/// This dto is used for retrieving an existing Group. Represents the data structure sent to clients.
/// </summary>
public class GroupDto
{
    /// <summary>
    /// Gets or sets the primary key identifier for the Group.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the Group.
    /// </summary>
    public string Name { get; set; } = "";
}