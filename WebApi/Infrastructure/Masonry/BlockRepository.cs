using Microsoft.EntityFrameworkCore;
using WebApi.Interfaces;
using WebApi.Models.Masonry;

namespace WebApi.Infrastructure.Masonry;

public class BlockRepository : IBlockRepository
{
    private readonly AppDbContext _context;

    public BlockRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<BlockColor>> GetBlockColors() => await _context.BlockColors.ToListAsync();
}