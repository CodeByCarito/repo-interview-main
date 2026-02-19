import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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

  const renderItem = useCallback(
    ({ item }: { item: FinancialProduct }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardTextWrap}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardId}>ID: {item.id}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    ),
    [onItemPress]
  );

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
            placeholderTextColor="#999"
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
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay productos</Text>
            }
          />
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
    backgroundColor: '#ffffff',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 42,
    paddingBottom: 16,
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 12,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chevron: {
    fontSize: 20,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
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
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
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
