import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import type { FinancialProduct } from '../types/product';
import { NavBar } from '../components/NavBar';
import { ProductListSkeleton } from '../components/ProductListSkeleton';
import { productsApi } from '../api/products';

type Props = {
  onSelectProduct: (product: FinancialProduct) => void;
  onAdd: () => void;
};

export function ProductListScreen({ onSelectProduct, onAdd }: Props): React.JSX.Element {
  const [products, setProducts] = useState<FinancialProduct[]>([]);
  const [filtered, setFiltered] = useState<FinancialProduct[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
      setFiltered(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar productos');
      setProducts([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(products);
      return;
    }
    setFiltered(
      products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    );
  }, [search, products]);

  const onItemPress = useCallback(
    (product: FinancialProduct) => {
      onSelectProduct(product);
    },
    [onSelectProduct]
  );

  const onAddPress = useCallback(() => {
    onAdd();
  }, [onAdd]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <NavBar />
        <ProductListSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <NavBar />
      <View style={styles.mainContent}>
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      {error ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          {filtered.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No hay productos</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.listBlock}>
                {filtered.flatMap((item, i) => [
                  <TouchableOpacity
                    key={item.id}
                    style={styles.row}
                    onPress={() => onItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.rowTextWrap}>
                      <Text style={styles.rowName}>{item.name}</Text>
                      <Text style={styles.rowId}>ID: {item.id}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>,
                  i < filtered.length - 1 ? (
                    <View key={`sep-${item.id}`} style={styles.divider} />
                  ) : null,
                ].filter(Boolean))}
              </View>
            </ScrollView>
          )}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 42,
    paddingBottom: 42,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  countWrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  listBlock: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  rowTextWrap: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  rowId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  chevron: {
    fontSize: 24,
    color: '#999',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  errorWrap: {
    padding: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#FFDD03',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
