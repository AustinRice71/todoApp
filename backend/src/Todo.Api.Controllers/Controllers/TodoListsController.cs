using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Api.Controllers.Dto.Group;
using Todo.Data;
using Todo.Domain;

/// <summary>
/// Controller for managing TodoList entities.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TodoListsController : ControllerBase
{
    /// <summary>
    /// The database context for accessing Todo data.
    /// </summary>
    private readonly AppDbContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="TodoListsController"/> class with database context injection.
    /// </summary>
    /// <param name="context">The database context for accessing Todo data.</param>
    public TodoListsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Gets all groups.
    /// </summary>
    /// <returns>Returns a list of GroupDto objects.</returns>
    [HttpGet]
    public async Task<ActionResult<List<GroupDto>>> GetGroups()
    {
        var groups = await _context.Groups
            .AsNoTracking()
            .OrderBy(l => l.Name)
            .Select(l => new GroupDto
            {
                Name = l.Name
            })
            .ToListAsync();

        return Ok(groups);
    }

    /// <summary>
    /// Gets a specific Group by its identifier.
    /// </summary>
    /// <param name="id">The identifier of the Group to retrieve.</param>
    /// <returns>Returns a Group object.</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<GroupDto>> GetGroup(int id)
    {
        var group = await _context.Groups
            .AsNoTracking()
            .Where(l => l.Id == id)
            .Select(l => new GroupDto
            {
                Name = l.Name

            })
            .SingleOrDefaultAsync();

        return group is null ? NotFound() : Ok(group);
    }

    /// <summary>
    /// Created a new todo list.
    /// </summary>
    /// <param name="dto">The DTO containing the details of the todo list to create.</param>
    /// <returns>The created group DTO.</returns>
    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup(CreateGroupDto dto)
    {
        // Verify there is a group name.
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Group name is required.");
        }

        // Map DTO to entity.
        var group = new Group
        {
            Name = dto.Name.Trim()
        };

        // Add object to db.
        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        // Map entity to DTO for return.
        var result = new GroupDto
        {
            Id = group.Id,
            Name = group.Name
        };

        return CreatedAtAction(nameof(GetGroup), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates an existing group.
    /// </summary>
    /// <param name="id">The identifier of the group to update.</param>
    /// <param name="dto">The DTO containing the updated details of the group.</param>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGroup(int id, UpdateGroupDto dto)
    {
        // Verify list name exists.
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Group name is required.");
        }

        // Verify record exists in db.
        var group = await _context.Groups.FindAsync(id);
        if (group is null) return NotFound();

        // Make changes to record and save.
        group.Name = dto.Name.Trim();
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Deletes a specific todo list by its identifier.
    /// </summary>
    /// <param name="id">The identifier of the todo list to delete.</param>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoList(int id)
    {
        // Verify record exists in db.
        var todoList = await _context.Groups.FindAsync(id);
        if (todoList is null) return NotFound();

        // Remove record from db.
        _context.Groups.Remove(todoList);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}