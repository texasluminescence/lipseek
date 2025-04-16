import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  Dimensions,
  StatusBar as RNStatusBar,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PlatformVideoPlayer from '../components/PlatformVideoPlayer';
import { RootStackParamList } from '../types/navigation';
import { uploadVideo } from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

type PreviewScreenRouteProp = RouteProp<RootStackParamList, 'Preview'>;
type PreviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Preview'>;

const { width } = Dimensions.get('window');

const PreviewScreen: React.FC = () => {
  const navigation = useNavigation<PreviewScreenNavigationProp>();
  const route = useRoute<PreviewScreenRouteProp>();
  const { uri } = route.params;
  
  const [analyzing, setAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeVideo = async () => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const result = await uploadVideo(uri);
      setTranscript(result);
    } catch (err) {
      console.error('Error analyzing video:', err);
      setError('Failed to analyze video. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0F2E4C', '#0A1A2E']}
        style={styles.background}
      />
      
      <View style={styles.container}>
        <View style={styles.videoWrapper}>
          <View style={styles.videoContainer}>
            <PlatformVideoPlayer uri={uri} />
          </View>
        </View>
        
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {!transcript && !analyzing && (
            <View style={styles.infoCardContainer}>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle-outline" size={24} color="#00CED1" style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  Ready to analyze your recording. Our AI will transcribe the speech content.
                </Text>
              </View>
            </View>
          )}
          
          <Text style={styles.headerText}>Recording Preview</Text>
          
          {transcript ? (
            <View style={styles.resultContainer}>
              <View style={styles.transcriptHeader}>
                <Text style={styles.resultTitle}>Transcript</Text>
                <View style={styles.transcriptBadge}>
                  <Text style={styles.transcriptBadgeText}>Completed</Text>
                </View>
              </View>
              
              <ScrollView style={styles.transcriptContainer}>
                <Text style={styles.transcript}>{transcript}</Text>
              </ScrollView>
              
              <TouchableOpacity 
                style={styles.startOverButton}
                onPress={handleStartOver}
              >
                <LinearGradient
                  colors={['#106B7C', '#0E5A68']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.buttonText}>Start Over</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionContainer}>
              {analyzing ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.loadingIndicator}>
                    <ActivityIndicator size="large" color="#00CED1" />
                  </View>
                  <Text style={styles.loadingText}>Analyzing your recording...</Text>
                  <Text style={styles.loadingSubtext}>This may take a moment</Text>
                </View>
              ) : (
                <>
                  {error && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={22} color="#FF6B6B" />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.analyzeButton}
                    onPress={handleAnalyzeVideo}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#1E90FF', '#1A7AE0']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="mic" size={20} color="white" />
                      <Text style={styles.buttonText}>Analyze Speech</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A1A2E',
    paddingTop: RNStatusBar.currentHeight,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16, // Added padding for space at the edge of the screen
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  videoWrapper: {
    height: '60%', // Increased from 45% to show more of the recording vertically
    width: '100%',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 12, // Added border radius for better aesthetics
    overflow: 'hidden',
    marginTop: 10, // Added margin at the top
  },
  videoContainer: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    position: 'relative',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 75, // Increased to make room for the info card above
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  infoCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    alignItems: 'center',
    paddingTop: 10
  },
  infoCard: {
    backgroundColor: 'rgba(16, 107, 124, 0.15)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#00CED1',
    maxWidth: "70%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    color: '#E0E0E0',
    fontSize: 15,
    lineHeight: 22,
    flex: 1
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  analyzeButton: {
    width: width * 0.8,
    maxWidth: 300,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startOverButton: {
    width: width * 0.8,
    maxWidth: 300,
    borderRadius: 12,
    alignSelf: 'center',
    shadowColor: '#106B7C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#FF6B6B',
    marginLeft: 8,
    fontSize: 14,
  },
  resultContainer: {
    flex: 1,
    marginTop: 10,
    height: "auto",
    maxHeight: 75
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  transcriptBadge: {
    backgroundColor: 'rgba(0, 206, 209, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  transcriptBadgeText: {
    color: '#00CED1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  transcriptContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  transcript: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E0E0E0',
  },
});

export default PreviewScreen;