import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { MealPlan, Palette } from '../types';
import { AppText, Card, PageHeader, SectionTitle } from '../components/ui';

const days = [
  { id: 'Пн', date: '16' },
  { id: 'Вт', date: '17' },
  { id: 'Ср', date: '18' },
  { id: 'Чт', date: '19' },
  { id: 'Пт', date: '20' },
  { id: 'Сб', date: '21' },
  { id: 'Вс', date: '22' },
];

const rubles = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;

export function HomeScreen({
  palette,
  mealPlan,
  selectedDay,
  onSelectDay,
  onOpenRecipe,
  onOpenShopping,
  onOpenStores,
  onThemeToggle,
  isDark,
}: {
  palette: Palette;
  mealPlan: MealPlan;
  selectedDay: string;
  onSelectDay: (day: string) => void;
  onOpenRecipe: () => void;
  onOpenShopping: () => void;
  onOpenStores: () => void;
  onThemeToggle: () => void;
  isDark: boolean;
}) {
  const meal = mealPlan.meals.find((item) => item.day === selectedDay);
  const remaining = Math.max(mealPlan.budgetRub - mealPlan.spentRub, 0);
  const progress = mealPlan.budgetRub > 0
    ? `${Math.min((mealPlan.spentRub / mealPlan.budgetRub) * 100, 100)}%` as `${number}%`
    : '0%';

  return (
    <>
      <PageHeader
        title="Мой рацион"
        subtitle="План питания на неделю"
        palette={palette}
        onThemeToggle={onThemeToggle}
        isDark={isDark}
      />
      <View style={styles.budgetCard}>
        <View style={styles.budgetTop}>
          <View>
            <AppText size={13} color="#D8F3E4">Бюджет на неделю</AppText>
            <AppText size={29} weight="800" color="#FFFFFF" style={styles.budgetAmount}>
              {rubles(mealPlan.budgetRub)}
            </AppText>
          </View>
          <View style={styles.budgetIcon}><AppText size={21} color="#FFFFFF">₽</AppText></View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: progress }]} />
        </View>
        <View style={styles.budgetBottom}>
          <AppText size={12} color="#D8F3E4">Потрачено {rubles(mealPlan.spentRub)}</AppText>
          <AppText size={12} weight="600" color="#FFFFFF">Осталось {rubles(remaining)}</AppText>
        </View>
      </View>

      <View style={styles.weekHeading}>
        <AppText size={18} weight="700" color={palette.text}>Эта неделя</AppText>
        <AppText size={13} color={palette.muted}>16 – 22 ноября</AppText>
      </View>
      <View style={styles.weekRow}>
        {days.map((day) => {
          const selected = selectedDay === day.id;
          return (
            <Pressable
              key={day.id}
              onPress={() => onSelectDay(day.id)}
              style={({ pressed }) => [
                styles.dayCell,
                { backgroundColor: selected ? palette.green : palette.surface },
                pressed && styles.pressed,
              ]}
            >
              <AppText size={11} weight="500" color={selected ? '#D8F3E4' : palette.muted}>{day.id}</AppText>
              <AppText size={14} weight="700" color={selected ? '#FFFFFF' : palette.text}>{day.date}</AppText>
              <View style={[styles.dayDot, { backgroundColor: selected ? '#FFFFFF' : palette.green }]} />
            </Pressable>
          );
        })}
      </View>

      <SectionTitle
        title={selectedDay === 'Пн' ? 'Меню на сегодня' : `Меню на ${selectedDay}`}
        action={meal ? 'Все блюда' : undefined}
        onPress={onOpenRecipe}
        palette={palette}
      />
      {meal ? (
        <Pressable onPress={onOpenRecipe} style={({ pressed }) => pressed && styles.pressed}>
          <Card palette={palette} style={styles.mealCard}>
            <View style={styles.mealArtwork}>
              <View style={styles.artworkGlow} />
              <AppText size={76} style={styles.mealEmoji}>{meal.emoji}</AppText>
              <View style={styles.artworkBadge}>
                <AppText size={11} weight="700" color={palette.greenDark}>{meal.mealType.toUpperCase()}</AppText>
              </View>
            </View>
            <View style={styles.mealContent}>
              <View style={styles.mealHeading}>
                <View style={styles.mealTitleWrap}>
                  <AppText size={17} weight="700" color={palette.text}>{meal.title}</AppText>
                  <AppText size={13} color={palette.muted} style={styles.mealSub}>{meal.description}</AppText>
                </View>
                <AppText size={20} color={palette.muted}>›</AppText>
              </View>
              <View style={styles.mealMeta}>
                <AppText size={12} color={palette.muted}>◷  {meal.cookingMinutes} мин</AppText>
                <AppText size={12} color={palette.muted}>♧  {meal.calories} ккал</AppText>
                <AppText size={12} weight="600" color={palette.green}>♡  {rubles(meal.estimatedPriceRub)}</AppText>
              </View>
            </View>
          </Card>
        </Pressable>
      ) : (
        <Card palette={palette} style={styles.emptyCard}>
          <AppText size={13} color={palette.muted}>На этот день блюд пока нет.</AppText>
        </Card>
      )}

      <SectionTitle title="Всё под контролем" palette={palette} />
      <View style={styles.quickGrid}>
        <Pressable
          onPress={onOpenShopping}
          style={({ pressed }) => [styles.quickCard, { backgroundColor: palette.surface }, pressed && styles.pressed]}
        >
          <View style={[styles.quickIcon, { backgroundColor: palette.greenTint }]}><AppText size={20}>🛒</AppText></View>
          <AppText size={14} weight="700" color={palette.text}>Список покупок</AppText>
          <AppText size={12} color={palette.muted}>На эту неделю</AppText>
        </Pressable>
        <Pressable
          onPress={onOpenStores}
          style={({ pressed }) => [styles.quickCard, { backgroundColor: palette.surface }, pressed && styles.pressed]}
        >
          <View style={[styles.quickIcon, { backgroundColor: '#FFF3E5' }]}><AppText size={20}>⌕</AppText></View>
          <AppText size={14} weight="700" color={palette.text}>Где выгоднее</AppText>
          <AppText size={12} color={palette.muted}>Сравнить цены</AppText>
        </Pressable>
      </View>
      <View style={styles.homeBottomNote}>
        <AppText size={12} color={palette.muted}>✦  Планируй просто. Питайся с удовольствием.</AppText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  budgetCard: { padding: 19, borderRadius: 22, backgroundColor: '#159A61', marginBottom: 23, shadowColor: '#148A57', shadowOpacity: 0.17, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  budgetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  budgetAmount: { marginTop: 4 },
  budgetIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 7, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.22)', marginTop: 18, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 9 },
  budgetBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  weekHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 7 },
  dayCell: { flex: 1, height: 70, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 4 },
  dayDot: { width: 4, height: 4, borderRadius: 3, marginTop: 1 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  mealCard: { padding: 9, borderRadius: 22 },
  mealArtwork: { height: 176, borderRadius: 16, backgroundColor: '#E8F4EA', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artworkGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 100, backgroundColor: '#D5EBDD' },
  mealEmoji: { textAlign: 'center', textShadowColor: 'rgba(48,72,48,0.16)', textShadowRadius: 9, textShadowOffset: { width: 0, height: 5 } },
  artworkBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 10, backgroundColor: '#FFFFFF' },
  mealContent: { paddingHorizontal: 8, paddingTop: 14, paddingBottom: 7 },
  mealHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mealTitleWrap: { flex: 1 },
  mealSub: { marginTop: 3 },
  mealMeta: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 13 },
  emptyCard: { padding: 18 },
  quickGrid: { flexDirection: 'row', gap: 12 },
  quickCard: { flex: 1, padding: 14, borderRadius: 19, minHeight: 132, justifyContent: 'center', gap: 5 },
  quickIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  homeBottomNote: { alignItems: 'center', marginTop: 24 },
});
