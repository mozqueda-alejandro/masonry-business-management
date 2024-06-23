using WebApi.Models.Masonry;

namespace WebApi.Interfaces;

public interface IBlockService
{
    public Task AddBlockColor(BlockColor blockColor);
    public Task<List<BlockColor>> GetBlockColors();
    public Task SaveChanges();
}