using Microsoft.AspNetCore.Mvc;
using WebApi.Interfaces;
using WebApi.Models.Masonry;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MaterialsController : ControllerBase
    {
        private readonly IBlockService _blockService;

        public MaterialsController(IBlockService blockService)
        {
            _blockService = blockService;
        }
        
        [HttpGet]
        public async Task<ActionResult<List<BlockColor>>> GetBlockColors()
        {
            var colors = await _blockService.GetBlockColors();
            return Ok(colors);
        }
        
        [HttpPost]
        public async Task<ActionResult> PostBlockColor(BlockColor blockColor)
        {
            // Add block color to database if it doesn't already exist
            var existingColor = await _blockService.GetBlockColors();
            if (existingColor.Any(c => c.Name.Equals(blockColor.Name, StringComparison.CurrentCultureIgnoreCase)))
            {
                return BadRequest("Color already exists");
            }
            
            await _blockService.AddBlockColor(blockColor);
            return Ok();
        }
    }
}