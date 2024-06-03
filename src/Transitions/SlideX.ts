import { Slide } from "./Slide";

export class SlideX extends Slide {
  readonly styles = {
    opacity: this.animator.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        translateX: this.animator.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [-75, 0, 75],
        }),
      },
    ],
  };
}
