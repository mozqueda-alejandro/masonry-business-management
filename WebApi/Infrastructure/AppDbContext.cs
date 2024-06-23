using Microsoft.EntityFrameworkCore;
using WebApi.Models.Masonry;

namespace WebApi.Infrastructure;

public class AppDbContext : DbContext
{
    public DbSet<BlockColor> BlockColors { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}