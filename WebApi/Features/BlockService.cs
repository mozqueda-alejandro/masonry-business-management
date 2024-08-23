using Microsoft.EntityFrameworkCore;
using WebApi.Interfaces;
using WebApi.Models.Masonry;

namespace WebApi.Infrastructure.Masonry;

public class BlockService : IBlockService
{
    private readonly AppDbContext _context;

    public BlockService(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddBlockColor(BlockColor blockColor) => await _context.BlockColors.AddAsync(blockColor);
    public async Task<List<BlockColor>> GetBlockColors() => await _context.BlockColors.ToListAsync();
    public async Task SaveChanges() => await _context.SaveChangesAsync();
}