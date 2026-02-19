import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleDismiss = (): void => {
    this.setState({ error: null, errorInfo: null });
  };

  render(): ReactNode {
    const { error, errorInfo } = this.state;
    if (error) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Error (para debug)</Text>
            <TouchableOpacity onPress={this.handleDismiss} style={styles.button}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.label}>Mensaje:</Text>
            <Text style={styles.message}>{error.message}</Text>
            {error.stack ? (
              <>
                <Text style={styles.label}>Stack:</Text>
                <Text style={styles.stack} selectable>
                  {error.stack}
                </Text>
              </>
            ) : null}
            {errorInfo?.componentStack ? (
              <>
                <Text style={styles.label}>Component stack:</Text>
                <Text style={styles.stack} selectable>
                  {errorInfo.componentStack}
                </Text>
              </>
            ) : null}
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#b71c1c',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F5C842',
    marginTop: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  stack: {
    fontSize: 12,
    color: '#b0b0b0',
    fontFamily: 'monospace',
  },
  hint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: '#333',
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});
