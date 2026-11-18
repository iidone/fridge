import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import type { Palette, UserProfile } from '../types';
import { AppText, Card, PageHeader, SectionTitle } from '../components/ui';

function ProfileRow({
  icon,
  title,
  detail,
  palette,
  onPress,
}: {
  icon: string;
  title: string;
  detail: string;
  palette: Palette;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.profileRow,
        { borderBottomColor: palette.line },
        pressed && styles.rowPressed,
      ]}
    >
      <View style={[styles.profileIcon, { backgroundColor: palette.surfaceAlt }]}>
        <AppText size={17} color={palette.green}>{icon}</AppText>
      </View>
      <View style={styles.rowText}>
        <AppText size={13} weight="600" color={palette.text}>{title}</AppText>
        <AppText size={11} color={palette.muted}>{detail}</AppText>
      </View>
      <AppText size={20} color={palette.muted}>›</AppText>
    </Pressable>
  );
}

export function ProfileScreen({
  palette,
  isDark,
  onThemeToggle,
  onOpenSettings,
  onOpenRecipe,
  onOpenStores,
  onOpenHome,
  profile,
}: {
  palette: Palette;
  isDark: boolean;
  onThemeToggle: (value: boolean) => void;
  onOpenSettings: () => void;
  onOpenRecipe: () => void;
  onOpenStores: () => void;
  onOpenHome: () => void;
  profile: UserProfile;
}) {
  const goalLabel = {
    health: 'Питаться полезнее',
    economy: 'Экономить на продуктах',
    energy: 'Больше энергии',
  }[profile.nutritionGoal];

  return (
    <>
      <PageHeader title="Профиль" subtitle="Ваш помощник в планировании" palette={palette} />
      <Card palette={palette} style={styles.profileCard}>
        <View style={styles.avatar}><AppText size={28}>😊</AppText></View>
        <View style={styles.identity}>
          <AppText size={17} weight="700" color={palette.text}>Привет, {profile.name}!</AppText>
          <AppText size={12} color={palette.muted}>Планируем вкусную неделю</AppText>
        </View>
        <Pressable onPress={onOpenSettings} hitSlop={8}><AppText size={19} color={palette.muted}>⚙</AppText></Pressable>
      </Card>
      <SectionTitle title="Моё приложение" palette={palette} />
      <Card palette={palette} style={styles.menuCard}>
        <ProfileRow icon="♡" title="Избранные рецепты" detail="12 рецептов" palette={palette} onPress={onOpenRecipe} />
        <ProfileRow icon="▤" title="История рационов" detail="Ваши планы питания" palette={palette} onPress={onOpenHome} />
        <ProfileRow icon="⌖" title="Магазины рядом" detail="Выбрать магазин" palette={palette} onPress={onOpenStores} />
      </Card>
      <SectionTitle title="Настройки" palette={palette} />
      <Card palette={palette} style={styles.settingsCard}>
        <View style={styles.themeRow}>
          <View style={[styles.profileIcon, { backgroundColor: palette.surfaceAlt }]}>
            <AppText size={17} color={palette.green}>{isDark ? '☾' : '☼'}</AppText>
          </View>
          <View style={styles.rowText}>
            <AppText size={13} weight="600" color={palette.text}>Тёмная тема</AppText>
            <AppText size={11} color={palette.muted}>Комфортно для глаз вечером</AppText>
          </View>
          <Switch
            value={isDark}
            onValueChange={onThemeToggle}
            trackColor={{ false: palette.line, true: palette.green }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Тёмная тема"
          />
        </View>
        <ProfileRow icon="♧" title="Параметры питания" detail={`${goalLabel} · ${profile.dailyCalories} ккал/день`} palette={palette} onPress={onOpenSettings} />
        <ProfileRow icon="⌂" title="Домашние запасы" detail={`${profile.pantryItems.length} продуктов учитываются`} palette={palette} onPress={onOpenSettings} />
        <ProfileRow icon="◷" title="Уведомления" detail="Напоминания о покупках" palette={palette} onPress={onOpenSettings} />
      </Card>
      <View style={[styles.tip, { backgroundColor: palette.greenTint }]}>
        <AppText size={18}>🌱</AppText>
        <AppText size={12} color={palette.greenDark} style={styles.tipText}>
          Маленькие шаги к большим переменам. Ты молодец!
        </AppText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  avatar: { width: 54, height: 54, borderRadius: 19, backgroundColor: '#FFF0DF', alignItems: 'center', justifyContent: 'center' },
  identity: { flex: 1, marginLeft: 12, gap: 5 },
  menuCard: { paddingHorizontal: 14 },
  profileRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  profileIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, marginLeft: 11, gap: 4 },
  settingsCard: { paddingHorizontal: 14 },
  themeRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center' },
  tip: { flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 16, marginTop: 20 },
  tipText: { flex: 1, marginLeft: 10 },
  rowPressed: { opacity: 0.7 },
});
