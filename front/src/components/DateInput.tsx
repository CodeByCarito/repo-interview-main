import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { toDisplayDate, toApiDate } from '../utils/dateFormat';

export const yyyyMmDdToDdMmYyyy = toDisplayDate;

function formatAsDdMmYyyy(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

type Props = {
  label: string;
  value: string;
  onChangeValue: (yyyyMmDd: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function DateInput({
  label,
  value,
  onChangeValue,
  error,
  disabled,
  placeholder = 'DD/MM/AAAA',
}: Props): React.JSX.Element {
  const [display, setDisplay] = useState(() => toDisplayDate(value));
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    setDisplay(toDisplayDate(value));
  }, [value]);

  const handleChangeText = useCallback(
    (text: string) => {
      const formatted = formatAsDdMmYyyy(text);
      setDisplay(formatted);
      const yyyyMmDd = toApiDate(formatted);
      if (yyyyMmDd) {
        lastEmitted.current = yyyyMmDd;
        onChangeValue(yyyyMmDd);
      } else {
        lastEmitted.current = '';
        onChangeValue('');
      }
    },
    [onChangeValue]
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : undefined,
          disabled ? styles.inputDisabled : undefined,
        ]}
        value={display}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType="number-pad"
        maxLength={10}
        editable={!disabled}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 4,
  },
});
