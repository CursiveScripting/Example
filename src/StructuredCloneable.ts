// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#Supported_types

type StructuredCloneableBase = object | string | number | boolean | Date | null | undefined;

export type StructuredCloneable = StructuredCloneableBase
    | Array<StructuredCloneableBase>
    | Set<StructuredCloneableBase>
    | Map<StructuredCloneableBase, StructuredCloneableBase>;