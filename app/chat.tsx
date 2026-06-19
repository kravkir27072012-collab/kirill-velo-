import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IOSButton } from '../src/components/IOSButton';
import { IOSTextInput } from '../src/components/IOSTextInput';
import { isAiConfigured, sendChatMessage } from '../src/services/anthropic';
import { radius, spacing, typography, useTheme } from '../src/theme';
import { ChatMessage } from '../src/types';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Привет! Я помогу с обслуживанием и ремонтом велосипеда. Опишите проблему — например, «скрипит цепь» или «плохо переключаются скорости».',
  createdAt: Date.now(),
};

export default function ChatScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      createdAt: Date.now(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    try {
      const reply = await sendChatMessage(nextMessages, text);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: reply, createdAt: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: 'Не удалось получить ответ. Проверьте подключение к интернету и попробуйте снова.',
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {!isAiConfigured ? (
        <View style={[styles.banner, { backgroundColor: colors.warning }]}>
          <Text style={styles.bannerText}>
            Демо-режим: ANTHROPIC_API_KEY не настроен, ответы — заготовленные примеры.
          </Text>
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user'
                ? [styles.userBubble, { backgroundColor: colors.tint }]
                : [styles.aiBubble, { backgroundColor: colors.fill }],
            ]}
          >
            <Text style={[typography.body, { color: item.role === 'user' ? '#FFFFFF' : colors.label }]}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={[styles.inputBar, { borderTopColor: colors.separator }]}>
        <View style={{ flex: 1 }}>
          <IOSTextInput
            placeholder="Спросите про обслуживание..."
            value={input}
            onChangeText={setInput}
            multiline
          />
        </View>
        <View style={{ marginLeft: spacing.sm, width: 92 }}>
          <IOSButton title="Отправить" onPress={handleSend} disabled={!input.trim()} loading={sending} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  bubble: {
    maxWidth: '85%',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: radius.sm,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: radius.sm,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    borderTopWidth: 1,
  },
  banner: {
    padding: spacing.sm,
  },
  bannerText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 12,
  },
});
