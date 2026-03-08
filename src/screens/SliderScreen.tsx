import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { cacheDirectory, copyAsync } from 'expo-file-system/legacy';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { AVAILABLE_THEMES } from '../constants/themes';
import { RootStackParamList, GeneratedPhoto } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Slider'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SliderScreen({ navigation, route }: Props) {
  const { photos, initialIndex } = route.params;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  const getThemeGradient = (themeId: string): [string, string] => {
    const theme = AVAILABLE_THEMES.find((t) => t.id === themeId);
    return theme?.gradient ?? ['#333', '#555'];
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const downloadCurrent = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant media library access to save photos.');
      return;
    }

    try {
      const photo = photos[activeIndex];
      const filename = `selfie2swipe_${photo.themeId}_${Date.now()}.jpg`;
      const fileUri = cacheDirectory + filename;
      await copyAsync({ from: photo.uri, to: fileUri });
      await MediaLibrary.saveToLibraryAsync(fileUri);
      Alert.alert('Saved!', `"${photo.themeName}" photo saved to gallery.`);
    } catch {
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  const renderSlide = ({ item }: { item: GeneratedPhoto }) => {
    const gradient = getThemeGradient(item.themeId);
    return (
      <View style={styles.slide}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.uri }} style={styles.fullImage} resizeMode="cover" />
          <LinearGradient
            colors={[gradient[0] + '60', gradient[1] + '60']}
            style={styles.themeOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Top bar */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.themeName}>{photos[activeIndex]?.themeName}</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {activeIndex + 1}/{photos.length}
          </Text>
        </View>
      </SafeAreaView>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Dots indicator */}
        <View style={styles.dotsContainer}>
          {photos.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, idx === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.downloadBtn} onPress={downloadCurrent}>
          <Text style={styles.downloadBtnText}>Download This Photo 💾</Text>
        </TouchableOpacity>

        <Text style={styles.swipeHint}>Swipe left or right to browse</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  themeOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  counterBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  downloadBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 12,
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  swipeHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});
