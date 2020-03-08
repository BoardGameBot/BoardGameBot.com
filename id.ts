export enum Namespace {
    DISCORD, TELEGRAM
}

export interface Id {
    namespace: Namespace;
    value: string;
}