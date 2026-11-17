import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Palette, ShoppingItem } from '../types';
import { AppText, Card, PageHeader, PrimaryButton } from '../components/ui';

const rubles = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;

export function ShoppingScreen({
  palette,
  items,
  checkedItems,
  onToggle,
  onReset,
  onOpenStores,
}: {
  palette: Palette;
  items: ShoppingItem[];
  checkedItems: string[];
  onToggle: (id: string) => void;
  onReset: () => void;
  onOpenStores: () => void;
}) {
  const remaining = items.length - checkedItems.length;
  const total = items.reduce((sum, item) => sum + item.priceRub, 0);

  return (
    <>
      <PageHeader title="Покупки" subtitle={`${remaining} продуктов осталось`} palette={palette} />
      <View style={[styles.summary, { backgroundColor: palette.greenTint }]}>
        <View style={styles.summaryIcon}><AppText size={21}>🛍️</AppText></View>
        <View style={styles.summaryText}>
          <AppText size={14} weight="700" color={palette.text}>Покупки на эту неделю</AppText>
          <AppText size={12} color={palette.muted}>Для меню на 16 – 22 ноября</AppText>
        </View>
        <AppText size={14} weight="700" color={palette.green}>{rubles(total)}</AppText>
      </View>
      <View style={styles.listHeading}>
        <AppText size={18} weight="700" color={palette.text}>Список покупок</AppText>
        <Pressable onPress={onReset} hitSlop={8}>
          <AppText size={12} weight="600" color={palette.green}>Сбросить</AppText>
        </Pressable>
      </View>
      <Card palette={palette} style={styles.shoppingCard}>
        {items.map((item, index) => {
          const checked = checkedItems.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => onToggle(item.id)}
              style={({ pressed }) => [
                styles.row,
                index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.line },
                pressed && styles.rowPressed,
              ]}
            >
              <View style={[styles.checkCircle, { borderColor: checked ? palette.green : palette.line, backgroundColor: checked ? palette.green : 'transparent' }]}>
                {checked ? <AppText size={12} weight="700" color="#FFFFFF">✓</AppText> : null}
              </View>
              <View style={styles.itemEmoji}><AppText size={18}>{item.emoji}</AppText></View>
              <View style={styles.itemName}>
                <AppText
                  size={13}
                  weight="600"
                  color={checked ? palette.muted : palette.text}
                  style={checked ? styles.checkedText : undefined}
                >
                  {item.name}
                </AppText>
                <AppText size={11} color={palette.muted}>{item.amount}</AppText>
              </View>
              <AppText size={12} weight="600" color={checked ? palette.muted : palette.text}>{rubles(item.priceRub)}</AppText>
            </Pressable>
          );
        })}
      </Card>
      <Pressable
        onPress={onOpenStores}
        style={({ pressed }) => [styles.compareLink, { backgroundColor: palette.surface }, pressed && styles.pressed]}
      >
        <View style={[styles.compareIcon, { backgroundColor: '#FFF3E5' }]}><AppText size={18}>⌕</AppText></View>
        <View style={styles.compareText}>
          <AppText size={13} weight="700" color={palette.text}>Найти цены получше</AppText>
          <AppText size={11} color={palette.muted}>Сравним магазины рядом</AppText>
        </View>
        <AppText size={20} color={palette.muted}>›</AppText>
      </Pressable>
      <PrimaryButton title={`Купить всё за ${rubles(total)}`} onPress={onOpenStores} palette={palette} />
    </>
  );
}

const styles = StyleSheet.create({
  summary: { padding: 15, borderRadius: 19, flexDirection: 'row', alignItems: 'center', marginBottom: 23 },
  summaryIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(25,169,103,0.1)', alignItems: 'center', justifyContent: 'center' },
  summaryText: { flex: 1, marginLeft: 11, gap: 4 },
  listHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  shoppingCard: { paddingHorizontal: 13 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 67, gap: 10, paddingVertical: 8 },
  rowPressed: { opacity: 0.7 },
  checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  itemEmoji: { width: 37, height: 37, borderRadius: 13, backgroundColor: '#F5F7F5', alignItems: 'center', justifyContent: 'center' },
  itemName: { flex: 1, gap: 4 },
  checkedText: { textDecorationLine: 'line-through' },
  compareLink: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 13, marginTop: 16 },
  compareIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  compareText: { flex: 1, marginLeft: 11, gap: 4 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
