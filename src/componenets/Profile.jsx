import { View, Text, StyleSheet, Pressable } from 'react-native';

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
            <Text style={styles.level}>Ниво: {displayUser.level}</Text>
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
            <Pressable style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>Редактирай профил</Text>
            </Pressable>
            {onLogout && (
              <Pressable style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutButtonText}>Излез</Text>
              </Pressable>
            )}
          </>
        ) : (
          <Pressable style={styles.editButton} onPress={onEdit}>
            <Text style={styles.editButtonText}>Влез в акаунт</Text>
          </Pressable>
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
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
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
  level: {
    fontSize: 14,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    marginRight: 12,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  editButton: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: '#ff4444',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});


