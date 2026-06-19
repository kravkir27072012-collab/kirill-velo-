import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Chip } from '../../src/components/Chip';
import { IOSButton } from '../../src/components/IOSButton';
import { IOSTextInput } from '../../src/components/IOSTextInput';
import { OfferRow } from '../../src/components/OfferRow';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { VideoGuideCard } from '../../src/components/VideoGuideCard';
import { partCategories } from '../../src/data/mock';
import { findVideoGuide, isAiConfigured, searchPartOffers } from '../../src/services/gemini';
import { spacing, typography, useTheme } from '../../src/theme';
import { MarketplaceOffer, VideoGuide } from '../../src/types';

export default function PartsScreen() {
  const { colors } = useTheme();
  const [bikeModel, setBikeModel] = useState('');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [customPart, setCustomPart] = useState('');
  const [results, setResults] = useState<{ offers: MarketplaceOffer[]; video: VideoGuide } | null>(null);
  const [loading, setLoading] = useState(false);

  const partName = customPart.trim() || partCategories.find((c) => c.id === selectedPartId)?.name || '';
  const canSearch = bikeModel.trim().length > 0 && partName.length > 0;

  async function handleSearch() {
    if (!canSearch || loading) return;
    setLoading(true);
    try {
      const [offers, video] = await Promise.all([
        searchPartOffers(partName, bikeModel),
        findVideoGuide(partName, bikeModel),
      ]);
      setResults({ offers, video });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <ScreenHeader title="Запчасти" subtitle="Найдите нужную деталь и видео по её установке" />

      <Card style={styles.card}>
        <Text style={[typography.headline, { color: colors.label, marginBottom: spacing.sm }]}>
          Модель велосипеда
        </Text>
        <IOSTextInput
          placeholder="Например: Stark Slash 27.5"
          value={bikeModel}
          onChangeText={setBikeModel}
          autoCapitalize="none"
        />

        <Text style={[typography.headline, { color: colors.label, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
          Какая запчасть нужна?
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {partCategories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              selected={selectedPartId === category.id}
              onPress={() => {
                setSelectedPartId(category.id);
                setCustomPart('');
              }}
            />
          ))}
        </ScrollView>
        <View style={{ marginTop: spacing.sm }}>
          <IOSTextInput
            placeholder="Или впишите свою запчасть"
            value={customPart}
            onChangeText={(t) => {
              setCustomPart(t);
              if (t) setSelectedPartId(null);
            }}
          />
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <IOSButton title="Найти запчасть" onPress={handleSearch} disabled={!canSearch} loading={loading} />
        </View>
      </Card>

      {results ? (
        <>
          <Card style={styles.card}>
            <Text style={[typography.title3, { color: colors.label, marginBottom: spacing.sm }]}>
              Видео-инструкция по установке
            </Text>
            <VideoGuideCard video={results.video} />
          </Card>

          <Card style={styles.card}>
            <Text style={[typography.title3, { color: colors.label, marginBottom: spacing.sm }]}>
              Где купить
            </Text>
            {results.offers.map((offer) => (
              <OfferRow key={offer.id} offer={offer} />
            ))}
            <Text style={[typography.caption, { color: colors.tertiaryLabel, marginTop: spacing.sm }]}>
              {isAiConfigured
                ? 'Цены и ссылки найдены ИИ через веб-поиск и могут быть неточными — проверяйте перед покупкой.'
                : 'Цены и наличие — демо-данные. Нажмите на предложение, чтобы открыть поиск на сайте маркетплейса.'}
            </Text>
          </Card>
        </>
      ) : null}
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
  },
});
