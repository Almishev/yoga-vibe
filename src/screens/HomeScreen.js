import { StyleSheet, Text, View, Image, Pressable, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTheme } from '../contexts/theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleGetStarted = () => {
    navigation.navigate('Courses');
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/yoga-vibe-4bdc3.firebasestorage.app/o/profile-images%2FgXAC050ARMZ2sXPcz79gghoepM22%2Fnewbanner%20(1).jpg?alt=media&token=99618308-e9f5-40e3-b5f4-c906892a8e15' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.teacherSection}>
              <Text style={styles.teacherName}>Василена Маркова</Text>
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherLine}>🧘‍♀️ Учител по йога 🧘‍♀️</Text>
                <Text style={styles.teacherLine}>🔮 Езотерика 🪬</Text>
                <Text style={styles.teacherLine}>🫀 Енергийна медицина 🧠</Text>
                <Text style={styles.teacherLine}>🌌 Космоенергетика 🌌</Text>
              </View>
            </View>
            
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Добре дошли</Text>
              <Text style={styles.heroSubtitle}>
                Готови ли сте за практика днес?
              </Text>
              <Pressable 
                style={[styles.getStartedButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
                onPress={handleGetStarted}
              >
                <Text style={[styles.getStartedButtonText, { color: theme.colors.primary }]}>Започнете сега</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    flex: 1,
    position: 'relative',
    minHeight: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  heroTextContainer: {
    alignItems: 'center',
    maxWidth: '90%',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  getStartedButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  teacherSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  teacherName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  teacherInfo: {
    alignItems: 'center',
    gap: 8,
  },
  teacherLine: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
