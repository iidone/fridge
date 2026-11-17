import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Palette } from '../types';
import { AppText, BackHeader, PrimaryButton, SectionTitle } from '../components/ui';

const stores = [
  { name: 'Пятёрочка', distance: '500 м от вас', price: 820, emoji: '🔴', tint: '#FFF0F0' },
  { name: 'Магнит', distance: '800 м от вас', price: 865, emoji: '🧲', tint: '#FFF4E8' },
  { name: 'Перекрёсток', distance: '1,2 км от вас', price: 910, emoji: '🟢', tint: '#EAF7EF' },
];

export function StoresScreen({
  palette,
  selectedStore,
  onSelect,
  onBack,
  onConfirm,
}: {
  palette: Palette;
  selectedStore: string;
  onSelect: (store: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <BackHeader title="Сравнение цен" onBack={onBack} palette={palette} />
      <View style={[styles.intro, { backgroundColor: palette.greenTint }]}>
        <AppText size={24}>📍</AppText>
        <View style={styles.introText}>
          <AppText size={13} weight="700" color={palette.text}>Магазины рядом</AppText>
          <AppText size={12} color={palette.muted}>Цены на 5 продуктов из списка</AppText>
        </View>
      </View>
      <SectionTitle title="Выгоднее всего" palette={palette} />
      {stores.map((store, index) => {
        const selected = selectedStore === store.name;
        return (
          <Pressable
            key={store.name}
            onPress={() => onSelect(store.name)}
            style={({ pressed }) => [
              styles.storeCard,
              { backgroundColor: palette.surface, borderColor: selected ? palette.green : palette.line, borderWidth: selected ? 1.5 : 1 },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.storeLogo, { backgroundColor: store.tint }]}><AppText size={18}>{store.emoji}</AppText></View>
            <View style={styles.storeDetails}>
              <View style={styles.storeNameRow}>
                <AppText size={14} weight="700" color={palette.text}>{store.name}</AppText>
                {index === 0 ? (
                  <View style={[styles.bestBadge, { backgroundColor: palette.greenTint }]}>
                    <AppText size={9} weight="700" color={palette.greenDark}>ВЫГОДНО</AppText>
                  </View>
                ) : null}
              </View>
              <AppText size={11} color={palette.muted}>{store.distance}</AppText>
            </View>
            <View style={styles.storePrice}>
              <AppText size={15} weight="700" color={palette.text}>{store.price} ₽</AppText>
              <AppText size={11} color={selected ? palette.green : palette.muted}>{selected ? 'Выбран' : 'Выбрать'}</AppText>
            </View>
          </Pressable>
        );
      })}
      <View style={[styles.savingsCard, { backgroundColor: palette.surface }]}>
        <View style={[styles.savingsIcon, { backgroundColor: palette.greenTint }]}><AppText size={19}>✦</AppText></View>
        <View style={styles.savingsText}>
          <AppText size={13} weight="700" color={palette.text}>Экономия до 90 ₽</AppText>
          <AppText size={11} color={palette.muted}>если выбрать магазин с лучшей ценой</AppText>
        </View>
      </View>
      <PrimaryButton title={`Выбрать «${selectedStore}»`} onPress={onConfirm} palette={palette} />
      <AppText size={11} color={palette.muted} style={styles.disclaimer}>
        Цены ориентировочные и могут отличаться в магазине.
      </AppText>
    </>
  );
}

const styles = StyleSheet.create({
  intro: { flexDirection: 'row', alignItems: 'center', borderRadius: 19, padding: 16, marginBottom: 3 },
  introText: { marginLeft: 11, gap: 4 },
  storeCard: { minHeight: 78, flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 18, marginBottom: 10 },
  storeLogo: { width: 43, height: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  storeDetails: { flex: 1, marginLeft: 11, gap: 5 },
  storeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  bestBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  storePrice: { alignItems: 'flex-end', gap: 4 },
  savingsCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 17, marginTop: 5 },
  savingsIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  savingsText: { marginLeft: 11, gap: 4 },
  disclaimer: { textAlign: 'center', marginTop: 13 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
