import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useBreakpoint } from "@/constants/responsive";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type AppShellProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  maxWidth?: number;
};

export function AppShell({ children, scrollable = true, maxWidth = 1400 }: AppShellProps) {
  const { isDesktop } = useBreakpoint();

  if (!isDesktop) {
    return <View style={styles.mobileContainer}>{children}</View>;
  }

  return (
    <View style={styles.desktopShell}>
      {/* Permanent Left Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <View style={styles.mainWorkspace}>
        <Header />
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
          >
            <View style={[styles.centeredContainer, { maxWidth }]}>
              {children}
            </View>
          </ScrollView>
        ) : (
          <View style={[styles.centeredContainer, styles.nonScrollContent, { maxWidth }]}>
            {children}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    backgroundColor: "#050816",
  },
  desktopShell: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#050816",
    width: "100%",
    height: "100%",
  },
  mainWorkspace: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#050816",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  nonScrollContent: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignSelf: "center",
  },
  centeredContainer: {
    width: "100%",
  },
});
