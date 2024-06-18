using WebApi.Models.Masonry;

namespace WebApi.Interfaces;

public interface IBlockRepository
{
    public Task<List<BlockColor>> GetBlockColors();
}