import { useWindowDimensions } from "react-native";

export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

export type BreakpointKey = "mobile" | "tablet" | "desktop" | "wide";

export function useBreakpoint(): {
  width: number;
  height: number;
  breakpoint: BreakpointKey;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
} {
  const { width, height } = useWindowDimensions();

  let breakpoint: BreakpointKey = "mobile";
  if (width >= Breakpoints.wide) {
    breakpoint = "wide";
  } else if (width >= Breakpoints.desktop) {
    breakpoint = "desktop";
  } else if (width >= Breakpoints.tablet) {
    breakpoint = "tablet";
  }

  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";
  const isDesktop = breakpoint === "desktop" || breakpoint === "wide";
  const isWide = breakpoint === "wide";

  return {
    width,
    height,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
  };
}
