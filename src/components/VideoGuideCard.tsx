import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview';
import { radius, spacing, typography, useTheme } from '../theme';
import { VideoGuide } from '../types';

export function VideoGuideCard({ video }: { video: VideoGuide }) {
  const { colors } = useTheme();
  const [playing, setPlaying] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.fill }]}>
      {playing ? (
        <View style={styles.player}>
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&playsinline=1` }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            style={styles.webview}
          />
        </View>
      ) : (
        <Pressable onPress={() => setPlaying(true)} style={styles.thumbnailWrap}>
          <Image
            source={{ uri: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` }}
            style={styles.thumbnail}
          />
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          <Text style={styles.duration}>{video.durationLabel}</Text>
        </Pressable>
      )}
      <View style={styles.info}>
        <Text style={[typography.subhead, { color: colors.label, fontWeight: '600' }]} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={[typography.caption, { color: colors.secondaryLabel, marginTop: 2 }]}>
          {video.channel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  thumbnailWrap: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -28,
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  duration: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  player: {
    aspectRatio: 16 / 9,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  info: {
    padding: spacing.md,
  },
});
