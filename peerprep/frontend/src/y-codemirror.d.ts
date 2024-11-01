/*declare module 'y-codemirror' {
export function CodemirrorBinding(editor: any, yText: any, options?: any): void;
// Add other exports if needed
}*/

declare module 'y-codemirror' {
    import { Editor } from 'codemirror';
    import { Awareness } from 'y-protocols/awareness';
    import { Text, UndoManager } from 'yjs';
    
    interface CodemirrorBindingOptions {
        yUndoManager?: UndoManager;
    }
    
    export class CodemirrorBinding {
        constructor(
            yText: Text,
            editor: Editor,
            awareness?: Awareness | null,
            options?: CodemirrorBindingOptions
        );
        destroy(): void;
    }
}