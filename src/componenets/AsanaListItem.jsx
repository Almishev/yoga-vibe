import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { useTheme } from '../contexts/theme';

export default function AsanaListItem({ asana, course }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const courseCategory = course?.category || 'yoga';
  const isCosmoenergetics = courseCategory === 'cosmoenergetics';

  const stylesThemed = useMemo(() => ({
    container: { backgroundColor: theme.colors.surface, borderRadius: 12, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: 12, minHeight: 100, alignItems: 'stretch' },
    image: { width: 100, alignSelf: 'stretch', backgroundColor: theme.colors.surfaceVariant },
    imagePlaceholder: { width: 100, alignSelf: 'stretch', backgroundColor: theme.colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 6 },
    subtitle: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18, flex: 1 },
    time: { fontSize: 13, color: theme.colors.primary, fontWeight: '600' },
    arrow: { fontSize: 20, color: theme.colors.primary, marginLeft: 8 },
  }), [theme]);

  const handlePress = () => {
    navigation.navigate('AsanaDetails', { asana, course });
  };

  return (
    <TouchableOpacity 
      style={stylesThemed.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {asana.image ? (
        <Image 
          source={{ uri: asana.image }} 
          style={stylesThemed.image}
          resizeMode="cover"
        />
      ) : (
        <View style={stylesThemed.imagePlaceholder}>
          <Ionicons 
            name={isCosmoenergetics ? "sparkles" : "fitness"} 
            size={40} 
            color={theme.colors.primary} 
          />
        </View>
      )}
      <View style={styles.content}>
        <Text style={stylesThemed.title}>{asana.name}</Text>
        {asana.description && (
          <Text style={stylesThemed.subtitle} numberOfLines={2}>
            {asana.description}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={stylesThemed.time}>
            {isCosmoenergetics 
              ? `${Math.round(asana.executionTime / 60)} минути` 
              : `${asana.executionTime} секунди`}
          </Text>
          <Text style={stylesThemed.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 12, justifyContent: 'space-between' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
});
