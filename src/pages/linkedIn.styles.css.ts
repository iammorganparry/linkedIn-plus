import { style } from "@vanilla-extract/css";

export const pageContainer = style({
  width: 400,
  height: 600,
  display: "flex",
  flexDirection: "column",
  borderRadius: 10,
  position: "absolute",
  top: 20,
  right: 20,
  backgroundColor: "white",
});
