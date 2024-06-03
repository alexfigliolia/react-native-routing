import { Animated } from "react-native";
import { Transition } from "./Transition";

export class NoopTransition extends Transition {
  animator = new Animated.Value(0);
  readonly styles = {};

  onEnter() {}

  onExit() {}
}
