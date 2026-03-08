import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { RootStackParamList, GeneratedPhoto } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

export default function ProcessingScreen({ navigation, route }: Props) {
  const { sourceUri, selectedThemes } = route.params;
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing animation for the photo
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  useEffect(() => {
    // Simulate processing each theme
    const totalThemes = selectedThemes.length;
    const perThemeTime = 1200;

    const timer = setInterval(() => {
      setCurrentThemeIndex((prev) => {
        const next = prev + 1;
        const newProgress = Math.min((next / totalThemes) * 100, 100);
        setProgress(newProgress);

        if (next >= totalThemes) {
          clearInterval(timer);

          // Generate mock photos and navigate to gallery
          const photos: GeneratedPhoto[] = selectedThemes.map((theme, idx) => ({
            id: `photo-${idx}`,
            uri: sourceUri,
            themeId: theme.id,
            themeName: theme.name,
          }));

          setTimeout(() => {
            navigation.replace('Gallery', { photos });
          }, 500);
        }

        return next;
      });
    }, perThemeTime);

    return () => clearInterval(timer);
  }, [selectedThemes, sourceUri, navigation]);

  const currentTheme =
    currentThemeIndex < selectedThemes.length
      ? selectedThemes[currentThemeIndex]
      : selectedThemes[selectedThemes.length - 1];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Creating Your Photos</Text>
        <Text style={styles.subtitle}>AI is working its magic...</Text>

        <Animated.View style={[styles.imageContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Image source={{ uri: sourceUri }} style={styles.sourceImage} />
          <View style={styles.imageOverlay}>
            <Text style={styles.themeIcon}>{currentTheme.icon}</Text>
          </View>
        </Animated.View>

        <Text style={styles.themeName}>
          Applying: {currentTheme.name}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        <Text style={styles.countText}>
          {Math.min(currentThemeIndex + 1, selectedThemes.length)} of {selectedThemes.length} photos
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
  imageContainer: {
    width: 200,
    height: 260,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 30,
  },
  sourceImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 56,
  },
  themeName: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  countText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 12,
  },
});
