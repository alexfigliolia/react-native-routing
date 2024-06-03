import { Slide } from "./Slide";

export class SlideY extends Slide {
  readonly styles = {
    opacity: this.animator.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        translateY: this.animator.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [-75, 0, 75],
        }),
      },
    ],
  };
}
