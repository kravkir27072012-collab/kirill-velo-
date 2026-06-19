import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { IOSButton } from '../../src/components/IOSButton';
import { IOSTextInput } from '../../src/components/IOSTextInput';
import { OfferRow } from '../../src/components/OfferRow';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { popularBikeModels } from '../../src/data/mock';
import { isAiConfigured, searchBikeOffers } from '../../src/services/gemini';
import { spacing, typography, useTheme } from '../../src/theme';
import { MarketplaceOffer } from '../../src/types';

export default function BikesScreen() {
  const { colors } = useTheme();
  const [bikeModel, setBikeModel] = useState('');
  const [offers, setOffers] = useState<MarketplaceOffer[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(model?: string) {
    const query = model ?? bikeModel;
    if (!query.trim() || loading) return;
    setBikeModel(query);
    setLoading(true);
    try {
      setOffers(await searchBikeOffers(query));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <ScreenHeader title="Велосипеды" subtitle="Подберите велосипед и получите совет от ИИ" />

      <Card style={styles.card}>
        <Text style={[typography.headline, { color: colors.label, marginBottom: spacing.sm }]}>
          Какой велосипед ищете?
        </Text>
        <IOSTextInput
          placeholder="Например: Trek Marlin 7"
          value={bikeModel}
          onChangeText={setBikeModel}
          autoCapitalize="none"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {popularBikeModels.map((model) => (
            <Chip key={model} label={model} selected={bikeModel === model} onPress={() => handleSearch(model)} />
          ))}
        </ScrollView>

        <View style={{ marginTop: spacing.lg }}>
          <IOSButton title="Найти велосипед" onPress={() => handleSearch()} disabled={!bikeModel.trim()} loading={loading} />
        </View>
      </Card>

      {offers ? (
        <Card style={styles.card}>
          <Text style={[typography.title3, { color: colors.label, marginBottom: spacing.sm }]}>
            Где купить
          </Text>
          {offers.map((offer) => (
            <OfferRow key={offer.id} offer={offer} />
          ))}
          <Text style={[typography.caption, { color: colors.tertiaryLabel, marginTop: spacing.sm }]}>
            {isAiConfigured
              ? 'Цены и ссылки найдены ИИ через веб-поиск и могут быть неточными — проверяйте перед покупкой.'
              : 'Цены — демо-данные для прототипа.'}
          </Text>
        </Card>
      ) : null}

      <Card style={[styles.card, styles.aiCard, { backgroundColor: colors.tint }]}>
        <Text style={[typography.title3, { color: '#FFFFFF' }]}>ИИ-помощник по ремонту</Text>
        <Text style={[typography.subhead, { color: 'rgba(255,255,255,0.85)', marginTop: spacing.xs }]}>
          Спросите что угодно про обслуживание велосипеда — получите понятную инструкцию
        </Text>
        <View style={{ marginTop: spacing.lg }}>
          <IOSButton title="Открыть чат с ИИ" onPress={() => router.push('/chat')} variant="secondary" />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  chipsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  aiCard: {
    shadowOpacity: 0,
  },
});
