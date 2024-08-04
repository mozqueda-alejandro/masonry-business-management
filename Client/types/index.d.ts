export {};

import { BlockType, FootingType, JobScope, SpecialBlockType, TopFinish, WallRepairPattern } from "./enums";

declare global {
    interface NavigationRequest {
        pageName: string;
        viewName: string;
    }

    interface SelectOption {
        name: string,
        value: any
    }

    interface Block extends IBlock {
        type: BlockType;
    }

    interface SpecialBlock extends IBlock {
        type: SpecialBlockType;
    }

    interface WallSpecs {
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

    type InstallationType = BaseWallType;
    type AdditionType = BaseWallType;
    type RepairType = BaseWallType;
    type StoneType = null;
    type DemoType = null;
    type TemporaryFenceType = null;



    type PartialWithUndefined<T> = {
        [K in keyof T]: T[K] | undefined;
    };
}

interface IBlock {
    width: number;
    color: string;
}

type BaseWallType = WallSpecs & BlockSpecs & SpecialBlockSpecs & RebarSpecs;
