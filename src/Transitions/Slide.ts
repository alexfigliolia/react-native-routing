import { Animated } from "react-native";
import { Transition } from "./Transition";

export class Slide extends Transition {
  animator = new Animated.Value(this.state === "active" ? 1 : 2);

  readonly styles = {};

  onEnter() {
    return new Promise(resolve => {
      Animated.timing(this.animator, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  onExit() {
    return new Promise<void>(resolve => {
      Animated.timing(this.animator, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        this.animator.setValue(2);
        resolve();
      });
    });
  }
}
