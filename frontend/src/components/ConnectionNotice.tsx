import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { Palette } from '../types';
import { AppText } from './ui';

export function ConnectionNotice({
  message,
  loading,
  onRetry,
  palette,
}: {
  message: string | null;
  loading: boolean;
  onRetry: () => void;
  palette: Palette;
}) {
  if (!message && !loading) return null;

  return (
    <View style={[styles.notice, { backgroundColor: palette.surface, borderColor: palette.line }]}>
      <View style={styles.message}>
        <AppText size={12} weight="600" color={palette.text}>
          {loading ? 'Подключаемся к API…' : message}
        </AppText>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={palette.green} />
      ) : (
        <Pressable onPress={onRetry} hitSlop={8}>
          <AppText size={12} weight="700" color={palette.green}>Повторить</AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 15, padding: 12, marginBottom: 16 },
  message: { flex: 1, marginRight: 10 },
});
