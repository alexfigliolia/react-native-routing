import { createContext } from "react";
import { RouteManager } from "Core";

export const BaseContext = createContext("/");

export const RouteContext = createContext(new RouteManager());
