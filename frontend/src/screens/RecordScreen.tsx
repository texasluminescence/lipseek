import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PlatformCameraView from '../components/PlatformCameraView';
import { RootStackParamList } from '../types/navigation';
import { useFocusEffect } from '@react-navigation/native';

const COLORS = {
  primary: '#0A2540',
  secondary: '#0F6884',
  accent: '#00B8D9', 
  surface: 'rgba(10, 37, 64, 0.85)', 
  text: '#FFFFFF',
  textSecondary: '#B3E5FC',
};

type RecordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Record'>;

const RecordScreen: React.FC = () => {
  const navigation = useNavigation<RecordScreenNavigationProp>();
  const [instructionOpacity] = useState(new Animated.Value(0));
  const [showInstructions, setShowInstructions] = useState(true);

  // Animate instructions when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (showInstructions) {
        Animated.timing(instructionOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }
      
      return () => {
        instructionOpacity.setValue(0);
      };
    }, [showInstructions])
  );

  const handleVideoRecorded = (uri: string) => {
    navigation.navigate('Preview', { uri });
  };
  
  const closeInstructions = () => {
    Animated.timing(instructionOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowInstructions(false);
    });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.cameraContainer}>
        <PlatformCameraView onVideoRecorded={handleVideoRecorded} />
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Record Video</Text>
      </View>
      
      {showInstructions && (
        <Animated.View 
          style={[
            styles.instructions,
            { opacity: instructionOpacity }
          ]}
        >
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeInstructions}
          >
            <MaterialIcons name="close" size={20} color={COLORS.text} />
          </TouchableOpacity>
          
          <MaterialIcons name="videocam" size={24} color={COLORS.accent} style={styles.instructionIcon} />
          <Text style={styles.instructionText}>
            Record a video of someone speaking clearly
          </Text>
          <Text style={styles.instructionSubtext}>
            Make sure there's good lighting and minimal background noise
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({ // ai generated styles
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 37, 64, 0.2)', 
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(10, 37, 64, 0.7)',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  instructions: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  instructionIcon: {
    marginBottom: 8,
  },
  instructionText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});

export default RecordScreen;