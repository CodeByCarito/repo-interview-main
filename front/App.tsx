import React, { useState, useCallback } from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import type { FinancialProduct } from './src/types/product';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ProductListScreen } from './src/screens/ProductListScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { ProductFormScreen } from './src/screens/ProductFormScreen';

type Screen =
  | { name: 'list' }
  | { name: 'detail'; product: FinancialProduct }
  | { name: 'form'; mode: 'add' }
  | { name: 'formEdit'; product: FinancialProduct };

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>({ name: 'list' });

  const goToList = useCallback(() => setScreen({ name: 'list' }), []);
  const goToDetail = useCallback((product: FinancialProduct) => setScreen({ name: 'detail', product }), []);
  const goToAddForm = useCallback(() => setScreen({ name: 'form', mode: 'add' }), []);
  const goToEditForm = useCallback((product: FinancialProduct) => setScreen({ name: 'formEdit', product }), []);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        {screen.name === 'list' && (
          <ProductListScreen onSelectProduct={goToDetail} onAdd={goToAddForm} />
        )}
        {screen.name === 'detail' && (
          <ProductDetailScreen
            product={screen.product}
            onBack={goToList}
            onEdit={goToEditForm}
            onDeleteSuccess={goToList}
          />
        )}
        {screen.name === 'form' && (
          <ProductFormScreen mode="add" onSuccess={goToList} onCancel={goToList}
           />
        )}
        {screen.name === 'formEdit' && (
          <ProductFormScreen
            mode="edit"
            initialProduct={screen.product}
            onSuccess={(updated) => goToDetail(updated ? { ...screen.product, ...updated } : screen.product)}
            onCancel={() => goToDetail(screen.product)}
          />
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;
