import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera as ExpoCamera } from 'expo-camera';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { ArrowLeft, Image as ImageIcon, Camera, RefreshCw } from 'lucide-react-native';
import { GeminiService } from '../services/GeminiService';
import { useAppStore } from '../services/store';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const router = useRouter();
  const addHistoryItem = useAppStore((state) => state.addHistoryItem);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Animation values
  const scanLineY = useSharedValue(0);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Loop scan line animation
    scanLineY.value = withRepeat(
      withTiming(260, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLineY.value }]
    };
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true
    });

    if (!result.canceled && result.assets[0].uri) {
      setPreviewImage(result.assets[0].uri);
      processImage(result.assets[0].base64 || "", result.assets[0].uri);
    }
  };

  const simulateCapture = async () => {
    // For local desktop test environment or simulator, we will trigger selection or simulate capture.
    setLoading(true);
    setTimeout(async () => {
      try {
        const dummyBase64 = ""; // We will trigger mock flow
        const result = await GeminiService.solveProblem({ text: "x^2 - 4 = 0" }, "Math");
        
        const id = addHistoryItem({
          problem: "Solve x^2 - 4 = 0",
          subject: "Math",
          explanation: result
        });
        
        setLoading(false);
        router.push({
          pathname: '/explanation',
          params: { id }
        });
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    }, 2000);
  };

  const processImage = async (base64: string, uri: string) => {
    setLoading(true);
    try {
      // Pass base64 to Gemini
      const explanation = await GeminiService.solveProblem({ base64Image: base64 }, "Math");
      
      const id = addHistoryItem({
        problem: "Image Homework Query",
        imageUri: uri,
        subject: "Math",
        explanation
      });
      
      setLoading(false);
      router.push({
        pathname: '/explanation',
        params: { id }
      });
    } catch (err) {
      setLoading(false);
      alert("Failed to analyze image. Reverting to mock response.");
      // Fallback
      const id = addHistoryItem({
        problem: "Solve x^2 - 4 = 0",
        subject: "Math",
        explanation: await GeminiService.solveProblem({ text: "x^2 - 4 = 0" }, "Math")
      });
      router.push({
        pathname: '/explanation',
        params: { id }
      });
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Homework Scanner</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Gemini AI is analyzing worksheet...</Text>
        </View>
      ) : (
        <View style={styles.scannerBody}>
          
          {/* Scanning Box Viewport */}
          <View style={styles.scanViewport}>
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
            
            {/* Corners */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            
            <View style={styles.helperTextContainer}>
              <Text style={styles.helperText}>Fit homework inside the frame</Text>
            </View>
          </View>

          {/* Action Bar */}
          <View style={styles.actionsBar}>
            <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
              <ImageIcon size={24} color="#ffffff" />
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={simulateCapture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={simulateCapture}>
              <RefreshCw size={24} color="#ffffff" />
              <Text style={styles.actionText}>Mock Solve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16121e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0c0a0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 14,
    opacity: 0.8,
  },
  scannerBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  scanViewport: {
    width: width * 0.8,
    height: 280,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 2,
    backgroundColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#8b5cf6',
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 12,
  },
  helperTextContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  helperText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    marginTop: 48,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 11,
    marginTop: 6,
    opacity: 0.7,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8b5cf6',
  }
});
