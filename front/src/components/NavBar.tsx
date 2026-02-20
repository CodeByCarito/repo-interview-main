import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';

const BANK_ICON = require('../assets/images/icon-bank.png');

export function NavBar(): React.JSX.Element {
  const navigation = useNavigation();

  const goToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'ProductList' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableOpacity
        style={styles.center}
        onPress={goToHome}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Volver a la lista de productos"
      >
        <Image source={BANK_ICON} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>
          BANCO
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334674',
    lineHeight: 26,
  },
});
