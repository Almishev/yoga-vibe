import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) {
  const { theme } = useTheme();
  const buttonStyle = [
    styles.button,
    { backgroundColor: theme.colors.primary },
    variant === 'secondary' && { backgroundColor: theme.colors.surfaceVariant },
    variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary },
    disabled && { backgroundColor: theme.colors.border },
    style,
  ];
  const textStyle = [
    styles.text,
    { color: theme.colors.onPrimary },
    variant === 'secondary' && { color: theme.colors.text },
    variant === 'outline' && { color: theme.colors.primary },
    disabled && { color: theme.colors.textSecondary },
  ];
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

