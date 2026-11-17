import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Не удалось открыть приложение</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8F6', justifyContent: 'center', paddingHorizontal: 24, paddingTop: 48 },
  title: { color: '#17251F', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  message: { color: '#56645C', fontSize: 14, lineHeight: 21 },
});
