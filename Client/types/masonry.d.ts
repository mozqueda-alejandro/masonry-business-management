export {};

import { BlockType, FootingType, JobScope, SpecialBlockType, TopFinish, WallRepairPattern } from "./enums";

declare global {

    interface Block extends IBlock {
        type: BlockType;
    }

    interface SpecialBlock extends IBlock {
        type: SpecialBlockType;
    }

    interface WallSpecs {
        lengthBlocksUsed: boolean;
        lengthBlocks: number;
        lengthFt: number;
        heightCourses: number;
        topFinish: TopFinish;
        segments: number;
        backPoints: number;
    }

    interface BlockSpecs {
        blockWidth: number;
        blockType: BlockType;
        blockColor: string;
        premixColor: string;
    }

    interface SpecialBlockSpecs {
        specialBlockWidth: number;
        specialBlockType: SpecialBlockType;
        specialBlockColor: string;
        specialLengthBlocksUsed: boolean;
        specialLengthBlocks: number;
        specialLengthFt: number;
        specialBlockCourses: string;
    }

    interface RebarSpecs {
        footingType: FootingType;
        footingWidthFt: number;
        footingDepthFt: number;
        horizontalInFooting: number;
        verticalSpacing: number;
        horizontalOnWall: number;
        embedmentDepth: number;
        existingDowels: boolean;
    }


    interface BaseWallSpecs extends WallSpecs, BlockSpecs, Partial<SpecialBlockSpecs>, RebarSpecs { }

    interface Installation extends JobTaskDetails, BaseWallSpecs { }
    interface Addition extends JobTaskDetails, BaseWallSpecs { }
    interface Repair extends JobTaskDetails, BaseWallSpecs { }
    interface Stone extends JobTaskDetails { }
    interface Demo extends JobTaskDetails {
        lengthBlocks: number;
    }
}

interface IBlock {
    width: number;
    color: string;
}
