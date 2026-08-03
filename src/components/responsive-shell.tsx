import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

type ResponsiveShellProps = {
  children: React.ReactNode;
  padding?: number;
};

export function ResponsiveShell({ children, padding = 20 }: ResponsiveShellProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inner,
          {
            paddingHorizontal: isDesktop ? 32 : padding,
            maxWidth: isDesktop ? 1280 : isTablet ? 960 : width,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  inner: {
    flex: 1,
    width: "100%",
  },
});
