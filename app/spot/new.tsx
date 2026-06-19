import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IOSButton } from '../../src/components/IOSButton';
import { IOSTextInput } from '../../src/components/IOSTextInput';
import { uploadSpotPhoto } from '../../src/services/supabase';
import { useSpotsStore } from '../../src/store/useSpotsStore';
import { radius, spacing, typography, useTheme } from '../../src/theme';

export default function NewSpotScreen() {
  const { colors } = useTheme();
  const addSpot = useSpotsStore((s) => s.addSpot);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = title.trim() && location.trim() && imageUri;

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!canSave || !imageUri) return;
    setSaving(true);
    try {
      const publicUrl = await uploadSpotPhoto(imageUri, `${Date.now()}.jpg`);
      addSpot({
        title: title.trim(),
        location: location.trim(),
        description: description.trim() || 'Отличное место для катания.',
        imageUrl: publicUrl,
        authorName: 'Вы',
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Pressable onPress={pickImage} style={[styles.imagePicker, { backgroundColor: colors.fill }]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={[typography.subhead, { color: colors.secondaryLabel }]}>
            Нажмите, чтобы выбрать фото места
          </Text>
        )}
      </Pressable>

      <Text style={[typography.headline, { color: colors.label, marginTop: spacing.lg }]}>Название</Text>
      <View style={{ marginTop: spacing.sm }}>
        <IOSTextInput placeholder="Например: Лесопарк у реки" value={title} onChangeText={setTitle} />
      </View>

      <Text style={[typography.headline, { color: colors.label, marginTop: spacing.lg }]}>Локация</Text>
      <View style={{ marginTop: spacing.sm }}>
        <IOSTextInput placeholder="Город, район" value={location} onChangeText={setLocation} />
      </View>

      <Text style={[typography.headline, { color: colors.label, marginTop: spacing.lg }]}>Описание</Text>
      <View style={{ marginTop: spacing.sm }}>
        <IOSTextInput
          placeholder="Что особенного в этом месте?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <IOSButton title="Опубликовать" onPress={handleSave} disabled={!canSave} loading={saving} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  imagePicker: {
    height: 200,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
