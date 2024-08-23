using CommunityToolkit.Diagnostics;

namespace WebApi;

public class Client
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public int Id { get; set; }
}

public class Location
{
    public string Address { get; set; }
    public string Zip { get; set; }
    public string State { get; set; }
    public int Id { get; set; }
}

public enum JobStatus
{
    // Obligatory
    NotBid,
    BidCreated,
    BidSent,

    // Non-Obligatory *Approved*
    AwardedNotScheduled,
    AwardedScheduled,
    AwardedWaiting,
    InProgress,
    Completed,

    // Non-Obligatory *Not Approved*
    NotAwarded,
    Archived
}

public enum JobScope
{
    Installation,
    Repair,
    Addition,
    Stone,
    TemporaryFence,
    Demo
}

public enum TopFinish
{
    Coping,
    Nellis,
    TwoInchCap,
    None
}

public enum WallRepairPattern
{
    Tooth,
    VShape,
    Square
}

public enum FootingType
{
    Centric,
    Excentric
}

public interface IBlock
{
    int Width { get; set; }
    string Color { get; set; }
}

public enum BlockType
{
    SlumpStone,
    Smooth,
    SplitFace
}

public class Block : IBlock
{
    public BlockType Type { get; set; }
    public int Width { get; set; }
    public string Color { get; set; }
}

public enum SpecialBlockType
{
    CornerFlute,
    CornerSplit,
    Flute,
    Netlis,
    Split
}

public class SpecialBlock : IBlock
{
    public SpecialBlockType Type { get; set; }
    public int Width { get; set; }
    public string Color { get; set; }
}

public class JobTask
{
    public JobScope Scope { get; set; }
    public int Price { get; set; }
    public string Description { get; set; }
    public int Id { get; set; }
}

public class Installation : JobTask
{
    // Wall Specifications
    public int LengthBlocks { get; set; }
    public int LengthFt { get; set; }
    public int HeightCourses { get; set; }
    public TopFinish TopFinish { get; set; }
    public int Segments { get; set; }
    public int BackPoints { get; set; }
    public int AColumns { get; set; }
    public int ACourses { get; set; }
    public int HColumns { get; set; }
    public int HCourses { get; set; }
    public WallRepairPattern WallRepairPattern { get; set; }

    // Block Specifications
    public Block Block { get; set; }
    public string PremixColor { get; set; }

    // Special Block Specifications
    public SpecialBlock SpecialBlock { get; set; }
    public string SpecialBlockCourses { get; set; }
    public int SpecialBlockAmount { get; set; }

    public bool ClarkCoStandard { get; set; }
    public bool InspectionRequired { get; set; }

    // Rebar Specifications
    public int FootingWidthFt { get; set; }
    public int FootingDepthFt { get; set; }
    public int HorizontalInFooting { get; set; }
    public int VerticalSpacing { get; set; }
    public int HorizontalOnWall { get; set; }
    public bool ExistingDowels { get; set; }
    public int EmbedmentDepth { get; set; }
    public FootingType FootingType { get; set; }
}

public class Estimate
{
    public List<JobTask> Tasks { get; set; }

    // Lay Up Challenges
    public bool InaccessibleToLayUp { get; set; }
    public bool InBetweenTrees { get; set; }
    public bool EightInchBlock { get; set; }
    public bool WallPattern { get; set; }
    public bool NextToPipes { get; set; }
    public bool InsurancePaid { get; set; }

    // Stock Challenges
    public bool StockChanges { get; set; }
    public bool FarFromWall { get; set; }
    public bool OutsideCornerLot { get; set; }
    public bool CoverPool { get; set; }
    public bool CoverLandscape { get; set; }
    public bool CoverConcrete { get; set; }
    public bool InaccessibleToStock { get; set; }

    // Concessions
    public bool PumpForFooting { get; set; }
    public bool PumpForWall { get; set; }
    public int StuccoSqFt { get; set; }
    public int PaintSqFt { get; set; }
    public bool PlasticSqFt { get; set; }
    public bool GateInstallation { get; set; }
    public bool TrashRemoval { get; set; }
    public int TrashRemovalPrice { get; set; }

    public int Id { get; set; }
    public DateTime Created { get; set; }
    public int ClientId { get; set; }
    public int JobId { get; set; }
}

public class Job
{
    public string Name { get; set; }
    public string Description { get; set; }
    public Location Location { get; set; }
    public DateTime Created { get; set; }
    public JobStatus Status { get; set; }
    public int Id { get; set; }
}