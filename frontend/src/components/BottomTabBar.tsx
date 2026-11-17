import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Palette, Tab } from '../types';
import { AppText } from './ui';

const tabs: { id: Tab; title: string; icon: string }[] = [
  { id: 'home', title: 'Главная', icon: '⌂' },
  { id: 'shopping', title: 'Покупки', icon: '▤' },
  { id: 'profile', title: 'Профиль', icon: '♙' },
];

export function BottomTabBar({
  activeTab,
  onSelect,
  palette,
}: {
  activeTab: Tab;
  onSelect: (tab: Tab) => void;
  palette: Palette;
}) {
  return (
    <View style={[styles.tabBar, { backgroundColor: palette.surface, borderTopColor: palette.line }]}>
      {tabs.map((tab) => {
        const selected = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelect(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
          >
            <View style={[styles.tabIconWrap, selected && { backgroundColor: palette.greenTint }]}>
              <AppText size={18} weight={selected ? '700' : '500'} color={selected ? palette.green : palette.muted}>
                {tab.icon}
              </AppText>
            </View>
            <AppText size={10} weight={selected ? '700' : '500'} color={selected ? palette.green : palette.muted}>
              {tab.title}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, paddingBottom: 20, paddingHorizontal: 12 },
  tabButton: { flex: 1, alignItems: 'center', gap: 3 },
  tabIconWrap: { minWidth: 52, height: 30, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
