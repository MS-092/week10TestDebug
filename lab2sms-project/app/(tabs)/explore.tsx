import { Image } from 'expo-image';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { NeonColors, Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const maxWidth = isLargeScreen ? 600 : '100%';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: NeonColors.darkBg, dark: NeonColors.darkBg }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <LinearGradient
            colors={[NeonColors.pink, NeonColors.purple]}
            style={styles.headerGradient}
          />
          <IconSymbol
            size={310}
            color={NeonColors.cyan}
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        </View>
      }>
      <View style={[styles.contentWrapper, { maxWidth }]}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.neonTitle}>EXPLORE</ThemedText>
        </ThemedView>
        
        <ThemedText style={styles.subtitle}>Example code to help you get started.</ThemedText>
        
        <View style={styles.cardOuter}>
          <LinearGradient
            colors={[NeonColors.cyan, NeonColors.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBorder}
          >
            <View style={styles.cardInner}>
              <Collapsible title="File-based routing">
                <ThemedText>
                  This app has two screens:{' '}
                  <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
                  <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
                </ThemedText>
                <ThemedText>
                  The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
                  sets up the tab navigator.
                </ThemedText>
                <ExternalLink href="https://docs.expo.dev/router/introduction">
                  <ThemedText type="link">Learn more</ThemedText>
                </ExternalLink>
              </Collapsible>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={[NeonColors.purple, NeonColors.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBorder}
          >
            <View style={styles.cardInner}>
              <Collapsible title="Android, iOS, and web support">
                <ThemedText>
                  You can open this project on Android, iOS, and the web. To open the web version, press{' '}
                  <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
                </ThemedText>
              </Collapsible>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={[NeonColors.pink, NeonColors.cyan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBorder}
          >
            <View style={styles.cardInner}>
              <Collapsible title="Images">
                <ThemedText>
                  For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
                  <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
                  different screen densities
                </ThemedText>
                <Image
                  source={require('@/assets/images/react-logo.png')}
                  style={{ width: 100, height: 100, alignSelf: 'center', tintColor: NeonColors.cyan }}
                />
                <ExternalLink href="https://reactnative.dev/docs/images">
                  <ThemedText type="link">Learn more</ThemedText>
                </ExternalLink>
              </Collapsible>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={[NeonColors.cyan, NeonColors.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBorder}
          >
            <View style={styles.cardInner}>
              <Collapsible title="Light and dark mode components">
                <ThemedText>
                  This template has light and dark mode support. The{' '}
                  <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
                  what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
                </ThemedText>
                <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
                  <ThemedText type="link">Learn more</ThemedText>
                </ExternalLink>
              </Collapsible>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={[NeonColors.purple, NeonColors.cyan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBorder}
          >
            <View style={styles.cardInner}>
              <Collapsible title="Animations">
                <ThemedText>
                  This template includes an example of an animated component. The{' '}
                  <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
                  the powerful{' '}
                  <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
                    react-native-reanimated
                  </ThemedText>{' '}
                  library to create a waving hand animation.
                </ThemedText>
                {Platform.select({
                  ios: (
                    <ThemedText>
                      The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
                      component provides a parallax effect for the header image.
                    </ThemedText>
                  ),
                })}
              </Collapsible>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    alignSelf: 'center',
    width: '100%',
  },
  headerImageContainer: {
    flex: 1,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
    opacity: 0.6,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  neonTitle: {
    color: NeonColors.pink,
    textShadowColor: NeonColors.pink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
  },
  subtitle: {
    color: '#888',
    marginBottom: 16,
  },
  cardOuter: {
    marginBottom: 12,
  },
  cardBorder: {
    borderRadius: 16,
    padding: 1,
  },
  cardInner: {
    backgroundColor: NeonColors.darkCard,
    borderRadius: 15,
    padding: 16,
  },
});
