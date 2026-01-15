using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Todo.Api.Controllers.Dto.TodoItem;
using Todo.Data;
using Todo.Domain;

/// <summary>
/// Controller for managing TodoItem entities.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TodoItemsController : ControllerBase
{
    /// <summary>
    /// The database context for accessing Todo data.
    /// </summary>
    private readonly AppDbContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="TodoItemsController"/> class with database context injection.
    /// </summary>
    /// <param name="context">The database context for accessing Todo data.</param>
    public TodoItemsController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Gets all TodoItems. 
    /// </summary>
    /// <returns>Returns a list of TodoItemDto objects.</returns>
    [HttpGet]
    public async Task<ActionResult<List<TodoItemDto>>> GetTodoItems()
    {
        var todoItems = await _context.TodoItems
            .AsNoTracking()
            .OrderBy(i => i.Title)
            .Select(i => new TodoItemDto
            {
                Title = i.Title,
                Description = i.Description,
                Completed = i.Completed,
                DueDate = i.DueDate,
                Priority = i.Priority,
                GroupId = i.GroupId,
                Id = i.Id
            })
            .ToListAsync();

        return Ok(todoItems);
    }

    /// <summary>
    /// Gets a specific TodoItem by its identifier.
    /// </summary>
    /// <param name="id">The identifier of the TodoItem to retrieve.</param>
    /// <returns>Returns a TodoItemDto object.</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItemDto>> GetTodoItem(int id)
    {
        var todoItem = await _context.TodoItems
            .AsNoTracking()
            .Where(i => i.Id == id)
            .Select(i => new TodoItemDto
            {
                Title = i.Title,
                Description = i.Description,
                Completed = i.Completed,
                DueDate = i.DueDate,
                Priority = i.Priority,
                GroupId = i.GroupId,
                Id = i.Id
            })
            .FirstOrDefaultAsync();

        if (todoItem is null)
        {
            return NotFound();
        }

        return Ok(todoItem);
    }

    /// <summary>
    /// Creates a new TodoItem.
    /// </summary>
    /// <param name="dto">The DTO containing the details of the TodoItem to create.</param>
    /// <returns>The created TodoItem DTO.</returns>
    [HttpPost]
    public async Task<ActionResult<TodoItemDto>> CreateTodoItem([FromBody] CreateTodoItemDto dto)
    {
        // Validate required fields.
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest("Title is required.");
        }
        else if (dto.GroupId <= 0)
        {
            return BadRequest("Valid GroupId is required.");
        }

        // Map DTO to entity.
        var todoItem = new TodoItem
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            Priority = dto.Priority,
            GroupId = dto.GroupId
        };

        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        // Map entity to dto for return.
        var result = new TodoItemDto
        {
            Title = todoItem.Title,
            Description = todoItem.Description,
            DueDate = todoItem.DueDate,
            Priority = todoItem.Priority,
            Completed = todoItem.Completed
        };

        return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTodoItem(int id, UpdateTodoItemDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            return BadRequest("Title is required.");
        }
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem is null) return NotFound();

        // Make changes to record and save.
        todoItem.Title = dto.Title;
        todoItem.Description = dto.Description;
        todoItem.DueDate = dto.DueDate;
        todoItem.Priority = dto.Priority;
        todoItem.Completed = dto.Completed;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/togglecomplete")]
    public async Task<ActionResult> ToggleComplete(int id)
    {
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem is null) return NotFound();

        todoItem.Completed = !todoItem.Completed;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTodoItem(int id)
    {
        var todoItem = await _context.TodoItems.FindAsync(id);

        if (todoItem is null) return NotFound();

        _context.TodoItems.Remove(todoItem);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}