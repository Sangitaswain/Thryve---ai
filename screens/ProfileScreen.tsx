
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, StyleSheet, Platform, Alert } from 'react-native';
import { Camera, ChevronRight, Bell, Shield, LogOut, Sun, Moon, Award, Flame } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

interface ProfileScreenProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ isDarkMode, toggleTheme }) => {
  
  const handleToggle = async () => {
    try {
      if (Haptics && Haptics.selectionAsync) {
        await Haptics.selectionAsync();
      }
    } catch (e) {
      console.log('Haptics not supported on this device');
    }
    toggleTheme();
  };

  const handleLinkPress = (label: string) => {
    try {
      if (Haptics && Haptics.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
    
    if (label === 'Sign Out') {
      if (Platform.OS !== 'web') {
        Alert.alert("Sign Out", "Are you sure you want to end your session?", [
          { text: "Cancel", style: "cancel" },
          { text: "Sign Out", style: "destructive", onPress: () => console.log('Sign Out') }
        ]);
      } else {
        console.log(`Navigating to ${label}`);
      }
    } else {
      console.log(`Navigating to ${label}`);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <Animated.View entering={ZoomIn.duration(600)} style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Alex&backgroundColor=b6e3f4' }} 
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity 
            style={styles.cameraButton}
            activeOpacity={0.8}
            onPress={() => handleLinkPress('Camera')}
          >
            <Camera color="white" size={16} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.delay(200)}>
          <View>
            <Text style={styles.userName}>Alex Thompson</Text>
            <View>
              <Award size={10} color="#D97706" />
              <Text>Pro</Text>
            </View>
          </View>
          <Text style={styles.userRole}>Wellness Enthusiast</Text>
        </Animated.View>
      </View>

      {/* Stats Row */}
      <Animated.View 
        entering={FadeInUp.delay(300)} 
        style={styles.statsRow}
      >
        <View style={styles.statItem}>
          <View>
            <Flame size={16} color="#4CB8A4" fill="#4CB8A4" />
            <Text style={[styles.statValue, { color: '#4CB8A4', marginLeft: 4 }]}>14</Text>
          </View>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <StatItem label="Active Mins" value="42" color="#6EC1E4" />
        <View style={styles.statDivider} />
        <StatItem label="Goal Score" value="89%" color="#4CB8A4" />
      </Animated.View>

      {/* Settings Sections */}
      <Animated.View entering={FadeInUp.delay(400)}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsMenu}>
          
          <View style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <View style={styles.menuIconBox}>
                {isDarkMode ? <Moon size={18} color="#4CB8A4" /> : <Sun size={18} color="#4CB8A4" />}
              </View>
              <View>
                <Text style={styles.menuLabel}>Appearance</Text>
                <Text style={styles.menuSublabel}>{isDarkMode ? 'Dark Protocol' : 'Standard View'}</Text>
              </View>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={handleToggle}
              trackColor={{ false: '#E2E8F0', true: '#4CB8A4' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E8F0"
            />
          </View>

          <SettingsLink 
            icon={Bell} 
            label="Notifications" 
            sublabel="Tactile Nudges" 
            onPress={() => handleLinkPress('Notifications')} 
          />
          <SettingsLink 
            icon={Shield} 
            label="Privacy & Security" 
            sublabel="Biometric Lock" 
            isLast 
            onPress={() => handleLinkPress('Privacy')}
          />
        </View>
      </Animated.View>

      {/* Sign Out Section */}
      <Animated.View entering={FadeInUp.delay(500)}>
        <TouchableOpacity 
          onPress={() => handleLinkPress('Sign Out')}
          style={styles.signOutButton}
          activeOpacity={0.6}
        >
          <LogOut color="#EF4444" size={18} style={{ marginRight: 10 }} />
          <Text style={styles.signOutText}>Secure Logout</Text>
        </TouchableOpacity>
        
        <Text>
          Version 2.5.0 • Powered by Gemini Live
        </Text>
      </Animated.View>

      <View style={{ height: 140 }} />
    </ScrollView>
  );
};

const StatItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <View style={styles.statItem}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SettingsLink = ({ icon: Icon, label, sublabel, isLast, onPress }: { icon: any, label: string, sublabel: string, isLast?: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
  >
    <View style={styles.menuInfo}>
      <View style={styles.menuIconBox}>
        <Icon size={18} color="#4CB8A4" />
      </View>
      <View>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuSublabel}>{sublabel}</Text>
      </View>
    </View>
    <ChevronRight size={16} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 45,
    borderWidth: 6,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 44,
    height: 44,
    borderRadius: 18,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  userRole: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 35,
    padding: 24,
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  settingsMenu: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    minHeight: 80,
  },
  menuInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  menuSublabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    borderRadius: 32,
  },
  signOutText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});

export default ProfileScreen;
