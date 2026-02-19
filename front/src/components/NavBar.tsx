import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const BANK_ICON = require('../assets/images/icon-bank.png');

export function NavBar(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
          <Image source={BANK_ICON} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>
          BANCO
        </Text>
      </View>
    </View>
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
