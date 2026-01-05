using Microsoft.EntityFrameworkCore;
using Todo.Domain;

namespace Todo.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems { get; set; }
    public DbSet<Group> Groups { get; set; }

    /// <summary>
    /// Configures the entity mappings and relationships for the database context.
    /// </summary>
    /// <param name="modelBuilder">The model builder used to configure the context.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Ensure TodoList Name is requires and has a max length of 200.
        modelBuilder.Entity<Group>()
            .Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();

        modelBuilder.Entity<Group>().ToTable("Groups");

        // Ensure TodoItem Title is required and has a max length of 300.
        modelBuilder.Entity<TodoItem>()
            .Property(x => x.Title)
            .HasMaxLength(300)
            .IsRequired();

        // Ensure TodoItem Description has a max length of 1000.
        modelBuilder.Entity<TodoItem>()
            .Property(x => x.Description)
            .HasMaxLength(1000);

        // Create an index on TodoItem for GroupId and Completed for faster querying.
        modelBuilder.Entity<TodoItem>()
            .HasIndex(x => new { x.GroupId, x.Completed });
    }
}