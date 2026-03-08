import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { AVAILABLE_THEMES, MAX_SELECTED_THEMES } from '../constants/themes';
import { Theme, RootStackParamList } from '../types';
import ThemeCard from '../components/ThemeCard';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Upload'>;
};

export default function UploadScreen({ navigation }: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>(
    AVAILABLE_THEMES.slice(0, MAX_SELECTED_THEMES)
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access to upload a selfie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera access to take a selfie.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const toggleTheme = (theme: Theme) => {
    setSelectedThemes((prev) => {
      const exists = prev.find((t) => t.id === theme.id);
      if (exists) {
        return prev.filter((t) => t.id !== theme.id);
      }
      if (prev.length >= MAX_SELECTED_THEMES) return prev;
      return [...prev, theme];
    });
  };

  const handleGenerate = () => {
    if (!photoUri) {
      Alert.alert('No photo', 'Please upload or take a selfie first.');
      return;
    }
    if (selectedThemes.length === 0) {
      Alert.alert('No themes', 'Please select at least one theme.');
      return;
    }
    navigation.navigate('Processing', {
      sourceUri: photoUri,
      selectedThemes: selectedThemes,
    });
  };

  const atLimit = selectedThemes.length >= MAX_SELECTED_THEMES;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={AVAILABLE_THEMES}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.themeRow}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Selfie2Swipe</Text>
            <Text style={styles.subtitle}>
              Transform your selfie into stunning dating profile photos
            </Text>

            {/* Photo Upload Area */}
            <View style={styles.uploadSection}>
              {photoUri ? (
                <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                  <Image source={{ uri: photoUri }} style={styles.previewImage} />
                  <View style={styles.changePhotoOverlay}>
                    <Text style={styles.changePhotoText}>Tap to change</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadButtons}>
                  <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                    <Text style={styles.uploadIcon}>🖼️</Text>
                    <Text style={styles.uploadBtnText}>Choose Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto}>
                    <Text style={styles.uploadIcon}>📸</Text>
                    <Text style={styles.uploadBtnText}>Take Selfie</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Theme Selection Header */}
            <View style={styles.themeSectionHeader}>
              <Text style={styles.sectionTitle}>Choose Your Themes</Text>
              <Text style={styles.themeCount}>
                {selectedThemes.length}/{MAX_SELECTED_THEMES} selected
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ThemeCard
            theme={item}
            selected={!!selectedThemes.find((t) => t.id === item.id)}
            onToggle={toggleTheme}
            disabled={atLimit}
          />
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
        contentContainerStyle={styles.listContent}
      />

      {/* Generate Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.generateBtn,
            (!photoUri || selectedThemes.length === 0) && styles.generateBtnDisabled,
          ]}
          onPress={handleGenerate}
          disabled={!photoUri || selectedThemes.length === 0}
        >
          <Text style={styles.generateBtnText}>
            Generate {selectedThemes.length} Profile Photos ✨
          </Text>
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
  listContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  uploadSection: {
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  changePhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.overlay,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  changePhotoText: {
    color: COLORS.text,
    fontSize: 14,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  uploadBtnText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  themeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  themeCount: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  themeRow: {
    justifyContent: 'space-between',
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
  },
  generateBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  generateBtnDisabled: {
    opacity: 0.4,
  },
  generateBtnText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
