import { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/theme';

export default function AsanaTimer({ initialSeconds, onComplete, isCosmoenergetics = false }) {
  const { theme } = useTheme();
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  const stylesThemed = useMemo(() => ({
    timerCircle: { width: 200, height: 65, borderRadius: 100, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
    timerText: { fontSize: 42, fontWeight: 'bold', color: theme.colors.onPrimary },
    completedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 4 },
    startButton: { backgroundColor: theme.colors.primary },
    buttonText: { color: theme.colors.onPrimary, fontSize: 16, fontWeight: '600' },
  }), [theme]);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            Vibration.vibrate(400);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setSeconds(initialSeconds);
  };

  const formatTime = (totalSeconds) => {
    if (isCosmoenergetics) {
      // За космоенергетика показваме времето като минути:секунди (напр. 45:00)
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      // За йога показваме времето като минути:секунди (напр. 01:30)
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[
        stylesThemed.timerCircle,
        isCosmoenergetics && styles.timerCircleCosmoenergetics,
        isCompleted && styles.timerCircleCompleted
      ]}>
        <Text style={[
          stylesThemed.timerText,
          isCosmoenergetics && styles.timerTextCosmoenergetics
        ]}>{formatTime(seconds)}</Text>
      </View>

      {isCompleted && (
        <View style={stylesThemed.completedBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.completedText}>
            {isCosmoenergetics ? 'Сеансът е завършен' : 'Практиката е завършена'}
          </Text>
        </View>
      )}

      <View style={styles.controlsContainer}>
        {!isRunning && !isCompleted && (
          <Pressable style={[styles.button, stylesThemed.startButton]} onPress={handleStart}>
            <Text style={stylesThemed.buttonText}>Старт</Text>
          </Pressable>
        )}

        {isRunning && (
          <Pressable style={[styles.button, styles.pauseButton]} onPress={handlePause}>
            <Text style={stylesThemed.buttonText}>Пауза</Text>
          </Pressable>
        )}

        {(isCompleted || seconds !== initialSeconds) && (
          <Pressable style={[styles.button, styles.resetButton]} onPress={handleReset}>
            <Text style={stylesThemed.buttonText}>Рестарт</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 10 },
  timerCircleCosmoenergetics: { width: 220, height: 75, borderRadius: 110 },
  timerCircleCompleted: { backgroundColor: '#4CAF50' },
  timerTextCosmoenergetics: { fontSize: 48 },
  completedText: { fontSize: 14, color: '#2E7D32', marginLeft: 8, fontWeight: '600' },
  controlsContainer: { flexDirection: 'row', gap: 15 },
  button: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, minWidth: 100, alignItems: 'center' },
  pauseButton: { backgroundColor: '#FF9800' },
  resetButton: { backgroundColor: '#2196F3' },
});

