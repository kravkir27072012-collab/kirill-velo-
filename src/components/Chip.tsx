import { Pressable, StyleSheet, Text } from 'react-native';
import { radius, spacing, typography, useTheme } from '../theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.tint : colors.fill,
        },
      ]}
    >
      <Text style={[typography.subhead, { color: selected ? '#FFFFFF' : colors.label }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
});
