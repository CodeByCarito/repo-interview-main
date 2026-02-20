import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { FinancialProduct } from '../types/product';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: FinancialProduct };
  ProductForm: { mode: 'add' } | { mode: 'edit'; product: FinancialProduct };
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

export type ProductListRouteProp = RouteProp<RootStackParamList, 'ProductList'>;
export type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
export type ProductFormRouteProp = RouteProp<RootStackParamList, 'ProductForm'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
