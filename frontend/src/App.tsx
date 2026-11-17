import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { BottomTabBar } from './components/BottomTabBar';
import { ConnectionNotice } from './components/ConnectionNotice';
import { useAppData } from './hooks/useAppData';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RecipeScreen } from './screens/RecipeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ShoppingScreen } from './screens/ShoppingScreen';
import { StoresScreen } from './screens/StoresScreen';
import { darkPalette, lightPalette } from './theme/palette';
import type { Screen, Tab } from './types';

export default function App() {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

function AppContent() {
  const [isDark, setIsDark] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedDay, setSelectedDay] = useState('Пн');
  const [checkedItems, setCheckedItems] = useState<string[]>(['yogurt']);
  const [selectedStore, setSelectedStore] = useState('Пятёрочка');
  const palette = isDark ? darkPalette : lightPalette;
  const screenMotion = useRef(new Animated.Value(1)).current;
  const { mealPlan, shoppingList, apiError, loading, refresh } = useAppData();

  useEffect(() => {
    setCheckedItems(shoppingList.items.filter((item) => item.checked).map((item) => item.id));
  }, [shoppingList]);

  useEffect(() => {
    screenMotion.setValue(0);
    Animated.timing(screenMotion, {
      toValue: 1,
      duration: 230,
      useNativeDriver: true,
    }).start();
  }, [screen, screenMotion]);

  const navigate = (next: Screen, tab?: Tab) => {
    if (tab) setActiveTab(tab);
    setScreen(next);
  };

  const openTab = (tab: Tab) => {
    setActiveTab(tab);
    setScreen(tab);
  };

  const toggleItem = (id: string) => {
    setCheckedItems((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const renderScreen = () => {
    switch (screen) {
      case 'recipe':
        return (
          <RecipeScreen
            palette={palette}
            meal={mealPlan.meals.find((item) => item.day === selectedDay)}
            onBack={() => navigate('home', 'home')}
            onAddIngredients={() => navigate('shopping', 'shopping')}
          />
        );
      case 'shopping':
        return (
          <ShoppingScreen
            palette={palette}
            items={shoppingList.items}
            checkedItems={checkedItems}
            onToggle={toggleItem}
            onReset={() => setCheckedItems([])}
            onOpenStores={() => navigate('stores')}
          />
        );
      case 'stores':
        return (
          <StoresScreen
            palette={palette}
            selectedStore={selectedStore}
            onSelect={setSelectedStore}
            onBack={() => navigate('shopping', 'shopping')}
            onConfirm={() => navigate('shopping', 'shopping')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            palette={palette}
            isDark={isDark}
            onThemeToggle={setIsDark}
            onOpenSettings={() => navigate('settings')}
            onOpenRecipe={() => navigate('recipe')}
            onOpenStores={() => navigate('stores')}
            onOpenHome={() => navigate('home', 'home')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            palette={palette}
            isDark={isDark}
            onThemeToggle={setIsDark}
            onBack={() => navigate('profile', 'profile')}
          />
        );
      default:
        return (
          <HomeScreen
            palette={palette}
            mealPlan={mealPlan}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onOpenRecipe={() => navigate('recipe')}
            onOpenShopping={() => navigate('shopping', 'shopping')}
            onOpenStores={() => navigate('stores')}
            onThemeToggle={() => setIsDark((value) => !value)}
            isDark={isDark}
          />
        );
    }
  };

  const hasTabs = screen === 'home' || screen === 'shopping' || screen === 'profile';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]} edges={['top', 'bottom']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        key={screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ConnectionNotice message={apiError} loading={loading} onRetry={() => void refresh()} palette={palette} />
        <Animated.View
          style={{
            opacity: screenMotion,
            transform: [{
              translateY: screenMotion.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }),
            }],
          }}
        >
          {renderScreen()}
        </Animated.View>
      </ScrollView>
      {hasTabs ? <BottomTabBar activeTab={activeTab} onSelect={openTab} palette={palette} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 28 },
});
