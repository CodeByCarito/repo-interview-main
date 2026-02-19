import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

export interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  disabled?: boolean;
}

export function FormInput({
  label,
  error,
  disabled,
  style,
  ...rest
}: FormInputProps): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : undefined,
          disabled ? styles.inputDisabled : undefined,
          style,
        ]}
        placeholderTextColor="#999"
        editable={!disabled}
        {...rest}
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
