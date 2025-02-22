import { Filter } from '../Filter';
export interface BlendModeFilterOptions {
    source?: string;
    gpu?: {
        functions?: string;
        main?: string;
    };
    gl?: {
        functions?: string;
        main?: string;
    };
}
export declare class BlendModeFilter extends Filter {
    constructor(options: BlendModeFilterOptions);
}
