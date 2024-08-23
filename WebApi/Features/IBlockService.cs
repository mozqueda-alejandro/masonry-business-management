using WebApi.Models.Masonry;

namespace WebApi.Interfaces;

public interface IBlockService
{
    // AddBlockColor(BlockColor blockColor)
    Task AddBlockColor(BlockColor blockColor);
    Task<List<BlockColor>> GetBlockColors();
    Task SaveChanges();
}