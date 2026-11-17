import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Palette } from '../types';

export function AppText({
  children,
  style,
  color,
  size = 14,
  weight = '400',
}: {
  children: React.ReactNode;
  style?: object;
  color?: string;
  size?: number;
  weight?: '400' | '500' | '600' | '700' | '800';
}) {
  return (
    <Text style={[{ color, fontSize: size, fontWeight: weight, letterSpacing: size <= 12 ? 0.1 : -0.2 }, style]}>
      {children}
    </Text>
  );
}

export function Card({
  children,
  palette,
  style,
}: {
  children: React.ReactNode;
  palette: Palette;
  style?: object;
}) {
  return (
    <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.line }, style]}>
      {children}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onPress,
  palette,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
  palette: Palette;
}) {
  return (
    <View style={styles.sectionTitle}>
      <AppText size={18} weight="700" color={palette.text}>{title}</AppText>
      {action ? (
        <Pressable onPress={onPress} hitSlop={8}>
          <AppText size={13} weight="600" color={palette.green}>{action}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  palette,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  palette: Palette;
  secondary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: secondary ? palette.greenTint : palette.green },
        pressed && styles.pressed,
      ]}
    >
      <AppText size={14} weight="700" color={secondary ? palette.greenDark : palette.white}>{title}</AppText>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  palette,
}: {
  icon: string;
  onPress: () => void;
  palette: Palette;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: palette.surface, borderColor: palette.line },
        pressed && styles.pressed,
      ]}
    >
      <AppText size={18} weight="600" color={palette.text}>{icon}</AppText>
    </Pressable>
  );
}

export function PageHeader({
  title,
  subtitle,
  palette,
  onThemeToggle,
  isDark,
}: {
  title: string;
  subtitle?: string;
  palette: Palette;
  onThemeToggle?: () => void;
  isDark?: boolean;
}) {
  return (
    <View style={styles.header}>
      <View>
        <AppText size={12} weight="600" color={palette.muted}>ПОНЕДЕЛЬНИК, 16 НОЯБРЯ</AppText>
        <AppText size={26} weight="800" color={palette.text} style={styles.headerTitle}>{title}</AppText>
        {subtitle ? <AppText size={13} color={palette.muted}>{subtitle}</AppText> : null}
      </View>
      {onThemeToggle ? (
        <Pressable
          onPress={onThemeToggle}
          accessibilityRole="switch"
          accessibilityLabel="Переключить тему"
          style={({ pressed }) => [
            styles.avatarButton,
            { backgroundColor: palette.greenTint },
            pressed && styles.pressed,
          ]}
        >
          <AppText size={19}>{isDark ? '☾' : '☼'}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function BackHeader({
  title,
  onBack,
  palette,
  action,
}: {
  title: string;
  onBack: () => void;
  palette: Palette;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.backHeader}>
      <IconButton icon="‹" onPress={onBack} palette={palette} />
      <AppText size={18} weight="700" color={palette.text} style={styles.backTitle}>{title}</AppText>
      {action || <View style={styles.headerActionPlaceholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 22, overflow: 'hidden' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 13 },
  primaryButton: { minHeight: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  iconButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  headerTitle: { marginTop: 5, marginBottom: 2 },
  avatarButton: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  backHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 21 },
  backTitle: { flex: 1, textAlign: 'center' },
  headerActionPlaceholder: { width: 42 },
});
