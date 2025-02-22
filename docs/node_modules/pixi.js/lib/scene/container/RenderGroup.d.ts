import { Matrix } from '../../maths/matrix/Matrix';
import { InstructionSet } from '../../rendering/renderers/shared/instructions/InstructionSet';
import type { Instruction } from '../../rendering/renderers/shared/instructions/Instruction';
import type { Container } from './Container';
/**
 * A RenderGroup is a class that is responsible for I generating a set of instructions that are used to render the
 * root container and its children. It also watches for any changes in that container or its children,
 * these changes are analysed and either the instruction set is rebuild or the instructions data is updated.
 * @memberof rendering
 */
export declare class RenderGroup implements Instruction {
    renderPipeId: string;
    root: Container;
    canBundle: boolean;
    renderGroupParent: RenderGroup;
    renderGroupChildren: RenderGroup[];
    worldTransform: Matrix;
    worldColorAlpha: number;
    worldColor: number;
    worldAlpha: number;
    readonly childrenToUpdate: Record<number, {
        list: Container[];
        index: number;
    }>;
    updateTick: number;
    readonly childrenRenderablesToUpdate: {
        list: Container[];
        index: number;
    };
    structureDidChange: boolean;
    instructionSet: InstructionSet;
    private readonly _onRenderContainers;
    init(root: Container): void;
    reset(): void;
    get localTransform(): Matrix;
    addRenderGroupChild(renderGroupChild: RenderGroup): void;
    private _removeRenderGroupChild;
    addChild(child: Container): void;
    removeChild(child: Container): void;
    removeChildren(children: Container[]): void;
    onChildUpdate(child: Container): void;
    updateRenderable(container: Container): void;
    onChildViewUpdate(child: Container): void;
    get isRenderable(): boolean;
    /**
     * adding a container to the onRender list will make sure the user function
     * passed in to the user defined 'onRender` callBack
     * @param container - the container to add to the onRender list
     */
    addOnRender(container: Container): void;
    removeOnRender(container: Container): void;
    runOnRender(): void;
    destroy(): void;
    getChildren(out?: Container[]): Container[];
    private _getChildren;
}
