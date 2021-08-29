import { IShop } from './shop';
import { IPrice } from './price';

export interface IProduct {
  _id: string;
  name: string;
  url: string;
  available: boolean;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  image: string;
  dateCreate: Date;
  dateUpdate: Date;
  prices?: IPrice[];
  shop: IShop;
}
