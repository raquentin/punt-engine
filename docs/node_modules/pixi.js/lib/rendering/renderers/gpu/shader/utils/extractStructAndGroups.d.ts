export interface StructsAndGroups {
    groups: {
        group: number;
        binding: number;
        name: string;
        isUniform: boolean;
        type: string;
    }[];
    structs: {
        name: string;
        members: Record<string, string>;
    }[];
}
export declare function extractStructAndGroups(wgsl: string): StructsAndGroups;
