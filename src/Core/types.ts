import type { ComponentType, ReactNode } from "react";
import type { PathStack } from "./PathStack";
import type { Router } from "./Router";
import type { Trie } from "./Trie";

export interface IRoute {
  path: string;
  cache?: boolean;
  prerender?: boolean;
  element?: ReactNode;
  Component?: ComponentType;
}

export type RouteStream = {
  navigation: Router;
};

export type IRouteState = "active" | "inactive" | "registered";

export type TransitionState = "entering" | "exiting" | null;

export interface IndexedRoute {
  path: string;
  route: IRoute;
  depth: number;
}

export type ITransitionCallback = () => Promise<any> | any;

export type TransitionPool = Map<string, ITransitionCallback>;

export type ITransitionEvents = {
  enter: undefined;
  exit: undefined;
};

export type MatchTuple = [
  path: string,
  stack: PathStack,
  catches: PathStack,
  params: Record<string, string>,
  current: Trie,
  tokens: string[],
];
