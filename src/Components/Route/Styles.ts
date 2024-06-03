import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    flex: 1,
  },
  inactive: {
    opacity: 0,
    right: "110%",
    pointerEvents: "none",
  },
});
