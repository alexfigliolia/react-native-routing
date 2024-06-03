import type { ReactNode } from "react";

export type Propless = Record<string, never>;

export interface OptionalChildren {
  children?: ReactNode;
}
