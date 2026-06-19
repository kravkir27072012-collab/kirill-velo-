import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography, useTheme } from '../theme';
import { MarketplaceOffer } from '../types';

const marketplaceColors: Record<string, string> = {
  Ozon: '#005BFF',
  Wildberries: '#CB11AB',
  Avito: '#00A046',
  AliExpress: '#FF4747',
};

export function OfferRow({ offer }: { offer: MarketplaceOffer }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => Linking.openURL(offer.url)}
      style={({ pressed }) => [
        styles.row,
        { borderColor: colors.separator, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View
        style={[styles.badge, { backgroundColor: marketplaceColors[offer.marketplace] ?? colors.fill }]}
      >
        <Text style={styles.badgeText}>{offer.marketplace}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[typography.subhead, { color: colors.label }]} numberOfLines={2}>
          {offer.title}
        </Text>
        {offer.rating ? (
          <Text style={[typography.caption, { color: colors.secondaryLabel, marginTop: 2 }]}>
            ★ {offer.rating.toFixed(1)}
          </Text>
        ) : null}
      </View>
      <Text style={[typography.headline, { color: colors.tint }]}>
        {offer.price.toLocaleString('ru-RU')} {offer.currency}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
});
