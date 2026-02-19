import { Platform } from 'react-native';

export const getApiBaseUrl = (): string => {
  if (__DEV__ && Platform.OS === 'android') {
    return 'http://10.0.2.2:3002';
  }
  return 'http://localhost:3002';
};

export const API_BASE = getApiBaseUrl();
