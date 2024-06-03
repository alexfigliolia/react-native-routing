import { Animated } from "react-native";
import { Transition } from "./Transition";

export class Fade extends Transition {
  animator = new Animated.Value(this.state === "active" ? 1 : 0);
  readonly styles = {
    opacity: this.animator.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

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
    return new Promise(resolve => {
      Animated.timing(this.animator, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(resolve);
    });
  }
}
