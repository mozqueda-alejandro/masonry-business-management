using Microsoft.AspNetCore.Mvc;
using WebApi.Interfaces;
using WebApi.Models.Masonry;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MaterialsController : ControllerBase
    {
        private readonly IBlockRepository _blockRepository;

        public MaterialsController(IBlockRepository blockRepository)
        {
            _blockRepository = blockRepository;
        }

        [HttpGet(Name = "GetBlockColors")]
        public async Task<ActionResult<List<BlockColor>>> Get()
        {
            var colors = await _blockRepository.GetBlockColors();
            return Ok(colors);
        }
    }
}