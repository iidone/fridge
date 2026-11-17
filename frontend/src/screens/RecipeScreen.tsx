import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Meal, Palette } from '../types';
import { BackHeader, Card, AppText, PrimaryButton, SectionTitle } from '../components/ui';

const ingredients = [
  ['🍗', 'Куриная грудка', '300 г', '170 ₽'],
  ['🌾', 'Гречка', '120 г', '35 ₽'],
  ['🍅', 'Томаты черри', '150 г', '95 ₽'],
  ['🥒', 'Огурец и зелень', 'по вкусу', '60 ₽'],
];

const steps = [
  'Отвари гречку в подсоленной воде до готовности.',
  'Обжарь курицу до золотистой корочки и приправь.',
  'Нарежь овощи, добавь зелень и подавай вместе.',
];

export function RecipeScreen({
  palette,
  meal,
  onBack,
  onAddIngredients,
}: {
  palette: Palette;
  meal: Meal | undefined;
  onBack: () => void;
  onAddIngredients: () => void;
}) {
  return (
    <>
      <BackHeader
        title="Рецепт"
        onBack={onBack}
        palette={palette}
        action={<View style={[styles.favorite, { backgroundColor: palette.surface, borderColor: palette.line }]}><AppText size={18} color={palette.text}>♡</AppText></View>}
      />
      <View style={[styles.artwork, { backgroundColor: palette.greenTint }]}>
        <View style={[styles.artworkCircle, { backgroundColor: palette.surface }]} />
        <AppText size={106} style={styles.emoji}>{meal?.emoji ?? '🥗'}</AppText>
        <View style={[styles.recipeTag, { backgroundColor: palette.surface }]}>
          <AppText size={11} weight="700" color={palette.greenDark}>ПОЛЕЗНО И ВКУСНО</AppText>
        </View>
      </View>
      <AppText size={26} weight="800" color={palette.text} style={styles.name}>
        {meal?.title ?? 'Рецепт'}{'\n'}{meal?.description ?? 'Подробности скоро появятся'}
      </AppText>
      <AppText size={14} color={palette.muted} style={styles.description}>
        Сбалансированный обед, который зарядит энергией и не ударит по бюджету.
      </AppText>
      <View style={styles.stats}>
        {[
          ['◷', `${meal?.cookingMinutes ?? 25} мин`],
          ['♧', `${meal?.calories ?? 430} ккал`],
          ['♙', '2 порции'],
        ].map(([icon, text]) => (
          <View key={text} style={[styles.statBox, { backgroundColor: palette.surface }]}>
            <AppText size={17} color={palette.green}>{icon}</AppText>
            <AppText size={12} weight="600" color={palette.text}>{text}</AppText>
          </View>
        ))}
      </View>
      <SectionTitle title="Ингредиенты" action="Добавить всё" onPress={onAddIngredients} palette={palette} />
      <Card palette={palette} style={styles.ingredientsCard}>
        {ingredients.map(([emoji, name, amount, price], index) => (
          <View
            key={name}
            style={[
              styles.ingredientRow,
              index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.line },
            ]}
          >
            <AppText size={19}>{emoji}</AppText>
            <View style={styles.ingredientName}>
              <AppText size={13} weight="600" color={palette.text}>{name}</AppText>
              <AppText size={11} color={palette.muted}>{amount}</AppText>
            </View>
            <AppText size={12} weight="600" color={palette.text}>{price}</AppText>
          </View>
        ))}
      </Card>
      <SectionTitle title="Как приготовить" palette={palette} />
      {steps.map((step, index) => (
        <View key={step} style={styles.stepRow}>
          <View style={[styles.stepNumber, { backgroundColor: palette.greenTint }]}>
            <AppText size={13} weight="700" color={palette.green}>{index + 1}</AppText>
          </View>
          <AppText size={13} color={palette.text} style={styles.stepText}>{step}</AppText>
        </View>
      ))}
      <PrimaryButton title="Добавить ингредиенты в список" onPress={onAddIngredients} palette={palette} />
    </>
  );
}

const styles = StyleSheet.create({
  favorite: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  artwork: { height: 250, borderRadius: 26, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artworkCircle: { position: 'absolute', width: 205, height: 205, borderRadius: 110 },
  emoji: { textShadowColor: 'rgba(48,72,48,0.16)', textShadowRadius: 10, textShadowOffset: { width: 0, height: 6 } },
  recipeTag: { position: 'absolute', left: 15, bottom: 15, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 11 },
  name: { marginTop: 20, lineHeight: 32 },
  description: { marginTop: 8, lineHeight: 21 },
  stats: { flexDirection: 'row', gap: 9, marginTop: 18 },
  statBox: { flex: 1, minHeight: 72, borderRadius: 17, alignItems: 'center', justifyContent: 'center', gap: 6 },
  ingredientsCard: { paddingHorizontal: 14 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13 },
  ingredientName: { flex: 1, gap: 3 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15, gap: 12 },
  stepNumber: { width: 27, height: 27, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stepText: { flex: 1, lineHeight: 21, paddingTop: 3 },
});
