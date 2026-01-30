import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:vasilena.markova94@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://imgk.timesnownews.com/story/bridge-pose.gif?tr=w-1200,h-900' }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.name}>Василена Маркова</Text>
          <Text style={styles.followers}>1,9 хил. приятели</Text>
          <Text style={styles.tagline}>Път към твоята собствена магия</Text>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Услуги</Text>
          <View style={styles.servicesContainer}>
            <View style={styles.serviceChip}>
              <Text style={styles.serviceText}>🧘‍♀️ Йога</Text>
            </View>
            <View style={styles.serviceChip}>
              <Text style={styles.serviceText}>🌌 Космоенергетика</Text>
            </View>
            <View style={styles.serviceChip}>
              <Text style={styles.serviceText}>✨ Аури</Text>
            </View>
            <View style={styles.serviceChip}>
              <Text style={styles.serviceText}>🫀 Духовно развитие</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>За мен</Text>
          <Text style={styles.aboutText}>
            Добре дошли в моя свят на йога, космоенергетика и духовно развитие! 
            Аз съм Василена Маркова и моята мисия е да ви помогна да откриете 
            вашата собствена магия и да намерите баланс в живота.
          </Text>
          <Text style={styles.aboutText}>
            Чрез практиките на йога, работа с аурите и космоенергетика, 
            ви помагам да се свържете с вашата вътрешна сила и да постигнете 
            хармония между тяло, душа и дух.
          </Text>
        </View>

        {/* Personal Sessions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Лични сесии</Text>
          <Text style={styles.aboutText}>
            Предлагам индивидуални сесии, адаптирани специално за вашите нужди. 
            Заедно ще работим върху вашите цели и ще създадем персонализирана 
            практика за вашето духовно развитие.
          </Text>
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaText}>↓ Лични сесии • Пиши ми 🩷</Text>
          </View>
        </View>

        {/* Contact Section */}
        <View style={[styles.section, styles.bottomPadding]}>
          <Text style={styles.sectionTitle}>Контакт</Text>
          <TouchableOpacity style={styles.infoRow} onPress={handleEmailPress}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={22} color="#9B59B6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>vasilena.markova94@gmail.com</Text>
              <Text style={styles.infoLink}>Tap to Email →</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#9B59B6',
    padding: 24,
    alignItems: 'center',
    paddingBottom: 32,
  },
  profileContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  followers: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  ctaContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: '#9B59B6',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    paddingTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
  },
  infoLink: {
    fontSize: 13,
    color: '#9B59B6',
    marginTop: 4,
  },
  bottomPadding: {
    paddingBottom: 24,
  },
});

