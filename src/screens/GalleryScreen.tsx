import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 40 - CARD_GAP) / 2;

export default function GalleryScreen({ navigation, route }: Props) {
  const { photos } = route.params;

  const getThemeGradient = (themeId: string): [string, string] => {
    const theme = AVAILABLE_THEMES.find((t) => t.id === themeId);
    return theme?.gradient ?? ['#333', '#555'];
  };

  const handlePhotoPress = (index: number) => {
    navigation.navigate('Slider', { photos, initialIndex: index });
  };

  const downloadAll = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant media library access to save photos.');
      return;
    }

    try {
      for (const photo of photos) {
        const filename = `selfie2swipe_${photo.themeId}_${Date.now()}.jpg`;
        const fileUri = cacheDirectory + filename;
        await copyAsync({ from: photo.uri, to: fileUri });
        await MediaLibrary.saveToLibraryAsync(fileUri);
      }
      Alert.alert('Saved!', `${photos.length} photos saved to your gallery.`);
    } catch {
      Alert.alert('Error', 'Failed to save photos. Please try again.');
    }
  };

  const renderPhoto = ({ item, index }: { item: GeneratedPhoto; index: number }) => {
    const gradient = getThemeGradient(item.themeId);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePhotoPress(index)}
        activeOpacity={0.85}
      >
        <View style={styles.cardInner}>
          <Image source={{ uri: item.uri }} style={styles.cardImage} />
          <LinearGradient
            colors={[gradient[0] + '80', gradient[1] + '80']}
            style={styles.themeOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.cardLabel}>
            <Text style={styles.cardLabelText}>{item.themeName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Profile Photos</Text>
        <Text style={styles.subtitle}>Tap any photo to view full screen</Text>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderPhoto}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.downloadAllBtn} onPress={downloadAll}>
          <Text style={styles.downloadAllText}>Download All Photos 💾</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newSessionBtn}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.newSessionText}>New Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardInner: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  themeOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    gap: 10,
  },
  downloadAllBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  downloadAllText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  newSessionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  newSessionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
