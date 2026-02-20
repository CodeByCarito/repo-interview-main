import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import type { FinancialProduct } from '../types/product';
import { NavBar } from '../components/NavBar';
import { toDisplayDate } from '../utils/dateFormat';
import { DeleteModal } from '../components/DeleteModal';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { productsApi } from '../api/products';

const EMPTY_LOGO = require('../assets/images/empty-image.jpg');

type Props = {
  product: FinancialProduct;
  onBack: () => void;
  onEdit: (product: FinancialProduct) => void;
  onDeleteSuccess: () => void;
};

const hasValidLogo = (logo: string | undefined) => logo != null && String(logo).trim() !== '';

export function ProductDetailScreen({ product, onBack, onEdit, onDeleteSuccess }: Props): React.JSX.Element {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const showEmptyLogo = !hasValidLogo(product.logo) || logoError;

  useEffect(() => {
    setLogoError(false);
  }, [product.id, product.logo]);

  const openDeleteModal = useCallback(() => setDeleteModalVisible(true), []);
  const closeDeleteModal = useCallback(() => setDeleteModalVisible(false), []);

  const handleEdit = useCallback(() => {
    onEdit(product);
  }, [onEdit, product]);

  const handleDeleteConfirm = useCallback(async () => {
    closeDeleteModal();
    try {
      await productsApi.delete(product.id);
      onDeleteSuccess();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Error al eliminar';
      Alert.alert('Error', message);
    }
  }, [product.id, closeDeleteModal, onDeleteSuccess]);

  const swipeBack = useSwipeBack(onBack);

  return (
    <View style={styles.screen}>
      <NavBar />
      <View style={styles.content} {...swipeBack.panHandlers}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.idTitle}>ID: {product.id}</Text>
        <Text style={styles.extraInfo}>Información extra</Text>
        <View style={styles.detailBlock}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{product.name}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.label}>Descripción</Text>
          <Text style={styles.value}>{product.description}</Text>
        </View>
        <View style={styles.logoBlock}>
          <Text style={styles.logoLabel}>Logo</Text>
          <View style={styles.logoWrap}>
            {showEmptyLogo ? (
              <Image
                source={EMPTY_LOGO}
                style={styles.logoImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{ uri: product.logo }}
                style={styles.logoImage}
                resizeMode="contain"
                onError={() => setLogoError(true)}
              />
            )}
          </View>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.label}>Fecha liberación</Text>
          <Text style={styles.value}>
            {toDisplayDate(product.date_release) || product.date_release}
          </Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.label}>Fecha revisión</Text>
          <Text style={styles.value}>
            {toDisplayDate(product.date_revision) || product.date_revision}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={openDeleteModal}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
      <DeleteModal
        visible={deleteModalVisible}
        productName={product.name}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  idTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  extraInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 48,
  },
  detailBlock: {
    marginBottom: 16,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#1a1a1a',
    textAlign:'right',
  },
  logoBlock: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  logoWrap: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 1.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  editButton: {
    backgroundColor: '#E9ECF4',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  deleteButton: {
    backgroundColor: '#D60608',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
