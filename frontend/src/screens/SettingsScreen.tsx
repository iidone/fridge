import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import type { Palette } from '../types';
import { AppText, BackHeader, Card, PrimaryButton, SectionTitle } from '../components/ui';

export function SettingsScreen({
  palette,
  isDark,
  onThemeToggle,
  onBack,
}: {
  palette: Palette;
  isDark: boolean;
  onThemeToggle: (value: boolean) => void;
  onBack: () => void;
}) {
  return (
    <>
      <BackHeader title="Настройки" onBack={onBack} palette={palette} />
      <SectionTitle title="Внешний вид" palette={palette} />
      <Card palette={palette} style={styles.settingsCard}>
        <View style={styles.themeRow}>
          <View style={[styles.icon, { backgroundColor: palette.surfaceAlt }]}>
            <AppText size={17} color={palette.green}>{isDark ? '☾' : '☼'}</AppText>
          </View>
          <View style={styles.themeText}>
            <AppText size={13} weight="600" color={palette.text}>Тёмная тема</AppText>
            <AppText size={11} color={palette.muted}>Сохраняет комфорт при слабом свете</AppText>
          </View>
          <Switch
            value={isDark}
            onValueChange={onThemeToggle}
            trackColor={{ false: palette.line, true: palette.green }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Тёмная тема"
          />
        </View>
      </Card>
      <SectionTitle title="Ваши предпочтения" palette={palette} />
      <Card palette={palette} style={styles.preferenceCard}>
        <AppText size={13} weight="600" color={palette.text}>Цель на неделю</AppText>
        <View style={styles.choiceRow}>
          {['Питаться полезнее', 'Экономить', 'Больше энергии'].map((choice, index) => (
            <Pressable
              key={choice}
              style={[
                styles.choice,
                {
                  backgroundColor: index === 0 ? palette.greenTint : palette.surfaceAlt,
                  borderColor: index === 0 ? palette.green : palette.line,
                },
              ]}
            >
              <AppText size={11} weight="600" color={index === 0 ? palette.greenDark : palette.muted}>{choice}</AppText>
            </Pressable>
          ))}
        </View>
        <View style={[styles.divider, { backgroundColor: palette.line }]} />
        <AppText size={13} weight="600" color={palette.text}>Недельный бюджет</AppText>
        <View style={[styles.budgetPreference, { backgroundColor: palette.surfaceAlt }]}>
          <AppText size={13} color={palette.muted}>−</AppText>
          <AppText size={16} weight="700" color={palette.text}>4 200 ₽</AppText>
          <AppText size={13} color={palette.green}>＋</AppText>
        </View>
      </Card>
      <PrimaryButton title="Сохранить настройки" onPress={onBack} palette={palette} />
    </>
  );
}

const styles = StyleSheet.create({
  settingsCard: { paddingHorizontal: 14 },
  themeRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center' },
  icon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  themeText: { flex: 1, marginLeft: 11, gap: 4 },
  preferenceCard: { padding: 16 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  choice: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 12 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 17 },
  budgetPreference: { height: 45, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 11 },
});
