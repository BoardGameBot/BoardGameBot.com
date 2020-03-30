export enum Namespace {
  DISCORD,
  TELEGRAM,
  TELEGRAM_USERNAME
}

export interface Id {
  namespace: Namespace;
  value: string;
}
