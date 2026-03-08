#!/bin/bash
# Run this script inside your cloned repo after:
#   git clone git@github.com:shaurbintalib/Selfie2Swipe.git
#   cd Selfie2Swipe
#
# Then: bash setup.sh

echo "Setting up Selfie2Swipe..."

# Init expo project
npx create-expo-app@latest . --template blank-typescript

# Install deps
npm install expo-image-picker expo-media-library expo-file-system \
  @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context \
  react-native-gesture-handler react-native-reanimated expo-linear-gradient

# Create dirs
mkdir -p src/{screens,components,constants,types}

echo "Done! Now copy the source files and run: npm start"
