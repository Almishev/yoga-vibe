import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

export default function Profile({ user, onEdit, onLogout }) {
  const displayUser = user || {
    name: 'Гост',
    email: 'guest@yogavibe.app',
    level: 'Начинаещ',
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayUser.name?.charAt(0)?.toUpperCase() || 'Г'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{displayUser.name}</Text>
            <Text style={styles.email}>{displayUser.email}</Text>
            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>Ниво:</Text>
              <Text style={styles.level}>{displayUser.level}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Моята практика</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Завършени курса</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Практики тази седмица</Text>
            </View>
          </View>
        </View>

        {user ? (
          <>
            <Button
              title="Редактирай профил"
              onPress={onEdit}
              variant="outline"
              style={styles.editButton}
            />
            {onLogout && (
              <Button
                title="Излез"
                onPress={onLogout}
                style={styles.logoutButton}
              />
            )}
          </>
        ) : (
          <Button
            title="Влез в акаунт"
            onPress={onEdit}
            variant="outline"
            style={styles.editButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#9B59B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  level: {
    fontSize: 14,
    color: '#9B59B6',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9B59B6',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    marginRight: 12,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e0f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9B59B6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  editButton: {
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: '#ff4444',
  },
});
