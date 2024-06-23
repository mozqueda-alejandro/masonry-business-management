using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Masonry;

[Table("block_color")]
public class BlockColor
{
    [Key]
    public int Id { get; set; }
    
    [MaxLength(64)]
    public string Name { get; init; }
    
    public BlockColor(string name)
    {
        Name = name;
    }
}