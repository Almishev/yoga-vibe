import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { useTheme } from '../contexts/theme';

export default function AboutScreen() {
  const { theme } = useTheme();

  const handleEmailPress = () => {
    Linking.openURL('mailto:vasilena.markova94@gmail.com');
  };

  const stylesThemed = useMemo(() => ({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { backgroundColor: theme.colors.primary, padding: 24, alignItems: 'center', paddingBottom: 32 },
    profileContainer: {
      width: 120, height: 120, borderRadius: 60, overflow: 'hidden', marginBottom: 16,
      borderWidth: 4, borderColor: theme.colors.onPrimary,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
    },
    name: { fontSize: 28, fontWeight: 'bold', color: theme.colors.onPrimary, marginBottom: 4 },
    followers: { fontSize: 14, color: theme.colors.onPrimary, opacity: 0.9, marginBottom: 8 },
    tagline: { fontSize: 16, color: theme.colors.onPrimary, opacity: 0.9, textAlign: 'center', fontStyle: 'italic' },
    section: { backgroundColor: theme.colors.surface, marginTop: 16, padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.colors.text, marginBottom: 12 },
    serviceChip: { backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
    serviceText: { fontSize: 14, color: theme.colors.text, fontWeight: '500' },
    aboutText: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 22, marginBottom: 12 },
    ctaContainer: { backgroundColor: theme.colors.background, borderRadius: 10, padding: 16, marginTop: 8, alignItems: 'center' },
    ctaText: { fontSize: 16, color: theme.colors.primary, fontWeight: '600' },
    infoRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceVariant },
    infoLabel: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 2 },
    infoValue: { fontSize: 15, color: theme.colors.text },
    infoLink: { fontSize: 13, color: theme.colors.primary, marginTop: 4 },
  }), [theme]);

  return (
    <SafeAreaView style={stylesThemed.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={stylesThemed.header}>
          <View style={stylesThemed.profileContainer}>
            <Image
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/yoga-vibe-4bdc3.firebasestorage.app/o/profile-images%2FgXAC050ARMZ2sXPcz79gghoepM22%2Fnewbanner%20(1).jpg?alt=media&token=99618308-e9f5-40e3-b5f4-c906892a8e15' }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <Text style={stylesThemed.name}>Василена Маркова</Text>
          <Text style={stylesThemed.followers}>
  Водя практики по йога и космоенергетика, в които съчетавам движение, дишане и енергийна работа, 
  за да помогна на хората да освободят напрежението, да се свържат с вътрешната си сила и да внесат 
  повече спокойствие и яснота в ежедневието си.
</Text>
          <Text style={stylesThemed.tagline}>Път към твоята собствена магия</Text>
        </View>

        <View style={stylesThemed.section}>
          <Text style={stylesThemed.sectionTitle}>Услуги</Text>
          <View style={styles.servicesContainer}>
            <View style={stylesThemed.serviceChip}>
              <Text style={stylesThemed.serviceText}>🧘‍♀️ Йога</Text>
            </View>
            <View style={stylesThemed.serviceChip}>
              <Text style={stylesThemed.serviceText}>🌌 Космоенергетика</Text>
            </View>
            <View style={stylesThemed.serviceChip}>
              <Text style={stylesThemed.serviceText}>✨ Аури</Text>
            </View>
            <View style={stylesThemed.serviceChip}>
              <Text style={stylesThemed.serviceText}>🫀 Духовно развитие</Text>
            </View>
          </View>
        </View>

        <View style={stylesThemed.section}>
          <Text style={stylesThemed.sectionTitle}>За мен</Text>
          <Text style={stylesThemed.aboutText}>
            Добре дошли в моя свят на йога, космоенергетика и духовно развитие! 
            Аз съм Василена Маркова и моята мисия е да ви помогна да откриете 
            вашата собствена магия и да намерите баланс в живота.
          </Text>
          <Text style={stylesThemed.aboutText}>
            Чрез практиките на йога, работа с аурите и космоенергетика, 
            ви помагам да се свържете с вашата вътрешна сила и да постигнете 
            хармония между тяло, душа и дух.
          </Text>
        </View>

       
        <View style={stylesThemed.section}>
          <Text style={stylesThemed.sectionTitle}>Лични сесии</Text>
          <Text style={stylesThemed.aboutText}>
            Предлагам индивидуални сесии, адаптирани специално за вашите нужди. 
            Заедно ще работим върху вашите цели и ще създадем персонализирана 
            практика за вашето духовно развитие.
          </Text>
          <View style={stylesThemed.ctaContainer}>
            <Text style={stylesThemed.ctaText}>↓ Лични сесии • Пиши ми 🩷</Text>
          </View>
        </View>

        <View style={[stylesThemed.section, styles.bottomPadding]}>
          <Text style={stylesThemed.sectionTitle}>Контакт</Text>
          <TouchableOpacity style={stylesThemed.infoRow} onPress={handleEmailPress}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={stylesThemed.infoLabel}>Email</Text>
              <Text style={stylesThemed.infoValue}>vasilena.markova94@gmail.com</Text>
              <Text style={stylesThemed.infoLink}>Tap to Email →</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    paddingTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  bottomPadding: {
    paddingBottom: 24,
  },
});

