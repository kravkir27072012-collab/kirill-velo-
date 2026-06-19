import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useTheme } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[typography.largeTitle, { color: colors.label }]}>{title}</Text>
      {subtitle ? (
        <Text style={[typography.subhead, { color: colors.secondaryLabel, marginTop: spacing.xs }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
