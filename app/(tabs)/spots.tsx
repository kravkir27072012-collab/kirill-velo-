import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useSpotsStore } from '../../src/store/useSpotsStore';
import { radius, spacing, typography, useTheme } from '../../src/theme';
import { RideSpot } from '../../src/types';

export default function SpotsScreen() {
  const { colors } = useTheme();
  const spots = useSpotsStore((s) => s.spots);
  const likedIds = useSpotsStore((s) => s.likedIds);
  const toggleLike = useSpotsStore((s) => s.toggleLike);

  function renderItem({ item }: { item: RideSpot }) {
    const liked = likedIds.has(item.id);
    return (
      <Pressable onPress={() => router.push(`/spot/${item.id}`)}>
        <Card style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.body}>
            <Text style={[typography.headline, { color: colors.label }]}>{item.title}</Text>
            <Text style={[typography.footnote, { color: colors.secondaryLabel, marginTop: 2 }]}>
              📍 {item.location}
            </Text>
            <Text
              style={[typography.subhead, { color: colors.label, marginTop: spacing.sm }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
            <View style={styles.footer}>
              <Text style={[typography.caption, { color: colors.tertiaryLabel }]}>{item.authorName}</Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  toggleLike(item.id);
                }}
                style={styles.likeButton}
              >
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={18}
                  color={liked ? colors.danger : colors.secondaryLabel}
                />
                <Text style={[typography.footnote, { color: colors.secondaryLabel, marginLeft: 4 }]}>
                  {item.likes}
                </Text>
              </Pressable>
            </View>
          </View>
        </Card>
      </Pressable>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={spots}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <ScreenHeader title="Места для катания" subtitle="Лучшие маршруты от сообщества" />
        }
        contentContainerStyle={styles.list}
      />
      <Pressable
        onPress={() => router.push('/spot/new')}
        style={[styles.fab, { backgroundColor: colors.tint }]}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacing.xxl * 2,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  body: {
    padding: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});
