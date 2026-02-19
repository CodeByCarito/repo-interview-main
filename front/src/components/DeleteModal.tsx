import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';

export interface DeleteModalProps {
  visible: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({
  visible,
  productName,
  onConfirm,
  onCancel,
}: DeleteModalProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.closeRow}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onCancel}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
          <Text style={styles.message}>
            ¿Estás seguro de eliminar el producto {productName}?
          </Text>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 1,
    borderRadius: 2,
    backgroundColor: '#ddd',
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    color: '#666',
  },
  message: {
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e8e8e8',
    marginHorizontal: -24,
  },
  confirmButton: {
    backgroundColor: '#FFDD03',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cancelButton: {
    backgroundColor: '#E9ECF4',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 0,
  },
  cancelText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
});
