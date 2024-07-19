import { createSystem } from "frog/ui";

export const { Box, Image, Icon, Text, VStack, Spacer, vars } = createSystem({
  colors: {
    bg: "rgb(93,71,154)",
    white: "rgb(245,254,255)",
  },
  fonts: {
    default: [
      {
        name: "Pixelify Sans",
        source: "google",
        weight: 400,
      },
      {
        name: "Pixelify Sans",
        source: "google",
        weight: 600,
      },
    ],
  },
});