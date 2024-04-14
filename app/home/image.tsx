import { Entypo, Octicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { theme } from '~/constants/theme';
import { hp, wp } from '~/helpers/common';

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const uri = item?.webformatURL;
  const [status, setStatus] = useState('loading');

  const fileName = item?.previewURL?.split('/').pop();
  const imageURL = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const onLoad = () => {
    setStatus('');
  };

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92);
    const calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      // portrait
      calculatedWidth = calculatedHeight * aspectRatio;
    }

    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const handleDownloadImage = async () => {
    setStatus('downloading');
    const uri = await downloadFile();
    if (uri) console.log('Image Downladed');
    showToast({ message: 'Image downloaded successfully' });
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageURL, filePath);
      setStatus('');
      console.log('downloaded at: ', uri);
      return uri;
    } catch (error) {
      console.log('Error downloading file:', error);
      setStatus('');
      Alert.alert('Error', 'Failed to download image');
      return null;
    }
  };

  const handleShareImage = async () => {
    setStatus('sharing');
    const uri = await downloadFile();
    if (uri) {
      await Sharing.shareAsync(uri);
      setStatus('');
    }
  };

  const showToast = ({ message }) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    });
  };

  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <BlurView tint="dark" intensity={60} style={styles.container}>
      <View style={getSize()}>
        <View style={styles.loading}>
          {status === 'loading' && <ActivityIndicator size="large" color="white" />}
        </View>
        <Image
          transition={100}
          source={{ uri }}
          style={[styles.image, getSize()]}
          onLoad={onLoad}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable onPress={() => router.back()} style={styles.button}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === 'downloading' ? (
            <View style={status.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable onPress={handleDownloadImage} style={styles.button}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === 'sharing' ? (
            <View style={status.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable onPress={handleShareImage} style={styles.button}>
              <Entypo name="share" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  toastText: {
    color: theme.colors.white,
    fontSize: hp(1.8),
    fontWeight: '600',
  },
});
