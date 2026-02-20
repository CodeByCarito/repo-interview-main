import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList, ProductFormRouteProp } from '../navigation/types';
import { NavBar } from '../components/NavBar';
import { FormInput } from '../components/FormInput';
import { DateInput } from '../components/DateInput';
import { toDisplayDate } from '../utils/dateFormat';
import { useSwipeBack } from '../hooks/useSwipeBack';
import {
  validateProductForm,
  hasFormErrors,
  computeRevisionDateFromRelease,
  validateDateRelease,
  type FormErrors,
  type ProductFormValues,
} from '../validation/productForm';
import { productsApi } from '../api/products';

type Nav = StackNavigationProp<RootStackParamList, 'ProductForm'>;

const emptyForm: ProductFormValues = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

export function ProductFormScreen(): React.JSX.Element {
  const { params } = useRoute<ProductFormRouteProp>();
  const navigation = useNavigation<Nav>();
  const mode = params.mode;
  const initialProduct = params.mode === 'edit' ? params.product : null;
  const isEdit = mode === 'edit' && initialProduct != null;

  const [values, setValues] = useState<ProductFormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [idChecking, setIdChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setValues({
        id: initialProduct.id,
        name: initialProduct.name,
        description: initialProduct.description,
        logo: initialProduct.logo,
        date_release: initialProduct.date_release,
        date_revision: initialProduct.date_revision,
      });
    }
  }, [initialProduct]);

  const setField = useCallback((field: keyof ProductFormValues, value: string) => {
    setValues(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'date_release') {
        next.date_revision = computeRevisionDateFromRelease(value);
      }
      return next;
    });
    setErrors(prev => {
      const next = { ...prev };
      if (field === 'date_release') {
        const err = validateDateRelease(value);
        if (err) next.date_release = err;
        else delete next.date_release;
      } else {
        delete next[field];
      }
      return next;
    });
  }, []);

  const validateIdUniqueness = useCallback(async (id: string): Promise<boolean> => {
    if (isEdit && initialProduct && id === initialProduct.id) return true;
    const exists = await productsApi.verifyIdExists(id);
    return !exists;
  }, [isEdit, initialProduct]);

  const handleSubmit = useCallback(async () => {
    const formErrors = validateProductForm(values);
    if (hasFormErrors(formErrors)) {
      setErrors(formErrors);
      return;
    }
    if (!isEdit) {
      setIdChecking(true);
      try {
        const idOk = await validateIdUniqueness(values.id);
        if (!idOk) {
          setErrors(prev => ({ ...prev, id: 'ID ya existe' }));
          setIdChecking(false);
          return;
        }
      } catch {
        setErrors(prev => ({ ...prev, id: 'Error al verificar ID' }));
        setIdChecking(false);
        return;
      }
      setIdChecking(false);
    }
    setSubmitting(true);
    try {
      if (isEdit && initialProduct) {
        const updated = await productsApi.update(values.id, {
          name: values.name,
          description: values.description,
          logo: values.logo,
          date_release: values.date_release,
          date_revision: values.date_revision,
        });
        Alert.alert('Éxito', 'Producto actualizado correctamente', [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('ProductDetail', {
                product: { ...initialProduct, ...updated },
              }),
          },
        ]);
      } else {
        await productsApi.create(values);
        Alert.alert('Éxito', 'Producto agregado correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al guardar';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  }, [values, isEdit, initialProduct, validateIdUniqueness, navigation]);

  const handleReset = useCallback(() => {
    if (initialProduct) {
      setValues({
        id: initialProduct.id,
        name: '',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      });
    } else {
      setValues(emptyForm);
    }
    setErrors({});
  }, [initialProduct]);

  const swipeBack = useSwipeBack(() => navigation.goBack());

  return (
    <View style={styles.screen}>
      <NavBar />
      <View style={styles.content} {...swipeBack.panHandlers}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Formulario de Registro</Text>
          <FormInput
            label="ID"
            value={values.id}
            onChangeText={v => setField('id', v)}
            error={errors.id}
            disabled={isEdit}
            autoCapitalize="none"
          />
          <FormInput
            label="Nombre"
            value={values.name}
            onChangeText={v => setField('name', v)}
            error={errors.name}
            placeholder="Tarjeta Crédito"
          />
          <FormInput
            label="Descripción"
            value={values.description}
            onChangeText={v => setField('description', v)}
            error={errors.description}
            placeholder="Descripción del producto"
            multiline
          />
          <FormInput
            label="Logo"
            value={values.logo}
            onChangeText={v => setField('logo', v)}
            error={errors.logo}
            placeholder="https://... o assets-1.png"
            autoCapitalize="none"
          />
          <DateInput
            label="Fecha Liberación"
            value={values.date_release}
            onChangeValue={v => setField('date_release', v)}
            error={errors.date_release}
            placeholder="DD/MM/AAAA"
          />
          <View style={styles.dateRevisionWrap} pointerEvents="none">
            <Text style={styles.dateRevisionLabel}>Fecha Revisión</Text>
            <View style={styles.dateRevisionInput}>
              <Text style={styles.dateRevisionText}>
                {values.date_revision ? toDisplayDate(values.date_revision) : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting || idChecking}
          >
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
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
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'left',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#FFDD03',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  resetButton: {
    backgroundColor: '#E9ECF4',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: 600,
  },
  dateRevisionWrap: {
    marginBottom: 16,
  },
  dateRevisionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  dateRevisionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  dateRevisionText: {
    fontSize: 16,
    color: '#666',
  },
});
