import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { useSpotsStore } from '../../src/store/useSpotsStore';
import { spacing, typography, useTheme } from '../../src/theme';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const spot = useSpotsStore((s) => s.spots.find((sp) => sp.id === id));
  const liked = useSpotsStore((s) => s.likedIds.has(id));
  const toggleLike = useSpotsStore((s) => s.toggleLike);

  if (!spot) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.label }}>Место не найдено</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Image source={{ uri: spot.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <Text style={[typography.title1, { color: colors.label }]}>{spot.title}</Text>
        <Text style={[typography.subhead, { color: colors.secondaryLabel, marginTop: spacing.xs }]}>
          📍 {spot.location}
        </Text>
        <Text style={[typography.body, { color: colors.label, marginTop: spacing.lg }]}>
          {spot.description}
        </Text>

        <View style={styles.footer}>
          <Text style={[typography.footnote, { color: colors.tertiaryLabel }]}>
            Добавил(а): {spot.authorName}
          </Text>
          <Pressable onPress={() => toggleLike(spot.id)} style={styles.likeButton}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={22}
              color={liked ? colors.danger : colors.secondaryLabel}
            />
            <Text style={[typography.subhead, { color: colors.secondaryLabel, marginLeft: spacing.xs }]}>
              {spot.likes}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 260,
  },
  body: {
    padding: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
