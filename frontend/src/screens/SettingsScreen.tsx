import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import type { Palette, NutritionGoal, UserProfile } from '../types';
import { AppText, BackHeader, Card, PrimaryButton, SectionTitle } from '../components/ui';

export function SettingsScreen({
  palette,
  isDark,
  onThemeToggle,
  onBack,
  profile,
  onSaveProfile,
}: {
  palette: Palette;
  isDark: boolean;
  onThemeToggle: (value: boolean) => void;
  onBack: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [budgetText, setBudgetText] = useState(String(profile.weeklyBudgetRub));
  const [caloriesText, setCaloriesText] = useState(String(profile.dailyCalories));

  const updateDraft = (changes: Partial<UserProfile>) => setDraft((current) => ({ ...current, ...changes }));
  const splitValues = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);
  const saveProfile = () => {
    onSaveProfile({
      ...draft,
      weeklyBudgetRub: Math.max(Number(budgetText) || profile.weeklyBudgetRub, 0),
      dailyCalories: Math.max(Number(caloriesText) || profile.dailyCalories, 1000),
    });
    onBack();
  };

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
        <AppText size={13} weight="600" color={palette.text}>Как к вам обращаться</AppText>
        <TextInput
          value={draft.name}
          onChangeText={(name) => updateDraft({ name })}
          placeholder="Ваше имя"
          placeholderTextColor={palette.muted}
          style={[styles.input, { backgroundColor: palette.surfaceAlt, color: palette.text, borderColor: palette.line }]}
          accessibilityLabel="Имя"
        />
        <AppText size={13} weight="600" color={palette.text} style={styles.fieldLabel}>Цель на неделю</AppText>
        <View style={styles.choiceRow}>
          {([
            ['health', 'Питаться полезнее'],
            ['economy', 'Экономить'],
            ['energy', 'Больше энергии'],
          ] as [NutritionGoal, string][]).map(([goal, choice]) => (
            <Pressable
              key={choice}
              onPress={() => updateDraft({ nutritionGoal: goal })}
              style={[
                styles.choice,
                {
                  backgroundColor: draft.nutritionGoal === goal ? palette.greenTint : palette.surfaceAlt,
                  borderColor: draft.nutritionGoal === goal ? palette.green : palette.line,
                },
              ]}
            >
              <AppText size={11} weight="600" color={draft.nutritionGoal === goal ? palette.greenDark : palette.muted}>{choice}</AppText>
            </Pressable>
          ))}
        </View>
        <View style={[styles.divider, { backgroundColor: palette.line }]} />
        <AppText size={13} weight="600" color={palette.text}>Недельный бюджет</AppText>
        <TextInput
          value={budgetText}
          onChangeText={setBudgetText}
          keyboardType="number-pad"
          style={[styles.input, { backgroundColor: palette.surfaceAlt, color: palette.text, borderColor: palette.line }]}
          accessibilityLabel="Недельный бюджет в рублях"
        />
        <AppText size={13} weight="600" color={palette.text} style={styles.fieldLabel}>Целевые калории в день</AppText>
        <TextInput
          value={caloriesText}
          onChangeText={setCaloriesText}
          keyboardType="number-pad"
          style={[styles.input, { backgroundColor: palette.surfaceAlt, color: palette.text, borderColor: palette.line }]}
          accessibilityLabel="Целевые калории в день"
        />
        <AppText size={13} weight="600" color={palette.text} style={styles.fieldLabel}>Аллергены</AppText>
        <TextInput
          defaultValue={profile.allergies.join(', ')}
          onChangeText={(value) => updateDraft({ allergies: splitValues(value) })}
          placeholder="Например: арахис, молоко"
          placeholderTextColor={palette.muted}
          style={[styles.input, { backgroundColor: palette.surfaceAlt, color: palette.text, borderColor: palette.line }]}
          accessibilityLabel="Аллергены"
        />
        <AppText size={13} weight="600" color={palette.text} style={styles.fieldLabel}>Нелюбимые продукты</AppText>
        <TextInput
          defaultValue={profile.dislikedFoods.join(', ')}
          onChangeText={(value) => updateDraft({ dislikedFoods: splitValues(value) })}
          placeholder="Например: кинза, сельдерей"
          placeholderTextColor={palette.muted}
          style={[styles.input, { backgroundColor: palette.surfaceAlt, color: palette.text, borderColor: palette.line }]}
          accessibilityLabel="Нелюбимые продукты"
        />
        <AppText size={13} weight="600" color={palette.text} style={styles.fieldLabel}>Уже есть дома</AppText>
        <TextInput
          defaultValue={profile.pantryItems.join(', ')}
          onChangeText={(value) => updateDraft({ pantryItems: splitValues(value) })}
          placeholder="Например: гречка, масло"
          placeholderTextColor={palette.muted}
          style={[styles.input, { backgroundColor: palette.surfaceAlt, color: palette.text, borderColor: palette.line }]}
          accessibilityLabel="Домашние запасы"
        />
      </Card>
      <PrimaryButton title="Сохранить настройки" onPress={saveProfile} palette={palette} />
    </>
  );
}

const styles = StyleSheet.create({
  settingsCard: { paddingHorizontal: 14 },
  themeRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center' },
  icon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  themeText: { flex: 1, marginLeft: 11, gap: 4 },
  preferenceCard: { padding: 16 },
  fieldLabel: { marginTop: 17 },
  input: { minHeight: 45, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, marginTop: 9, fontSize: 14 },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  choice: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 12 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 17 },
});
