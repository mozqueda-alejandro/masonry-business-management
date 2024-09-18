namespace WebApi;

public interface IWeighable
{
    public int Weight { get; set; }
}

public abstract class Material : IWeighable
{
    public string Code { get; set; }
    public string Description { get; set; }
    public int Weight { get; set; }
}

public class Block : Material, IBlock
{
    public int Width { get; set; }
    public string Color { get; set; }
    public string Type { get; set; }
}

public class SpecialBlock : Material, IBlock
{
    public int Width { get; set; }
    public string Color { get; set; }
    public string Type { get; set; }
}

public class Rebar : Material
{
    public double Length { get; set; }
    public int Diameter { get; set; }
    public string Shape { get; set; }
}

public class CementUnit
{
    
}

public class Cement : Material;



