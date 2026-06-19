import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { radius, spacing, typography, useTheme } from '../theme';

export function IOSTextInput(props: TextInputProps) {
  const { colors } = useTheme();
  return (
    <TextInput
      placeholderTextColor={colors.tertiaryLabel}
      style={[
        styles.input,
        typography.body,
        { backgroundColor: colors.fill, color: colors.label },
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
