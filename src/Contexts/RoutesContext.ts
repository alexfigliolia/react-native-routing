import { createContext } from "react";
import type { ITransitionName } from "Transitions";

export const RoutesContext = createContext<ITransitionName | undefined>(
  undefined,
);
