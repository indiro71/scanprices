export interface IPair {
  _id: string;
  isActive: boolean;
  name: string;
  symbol: string;
  contract: string;
  leverage: number;
  currentPrice: number;
  sellPercent: number;
  buyCoefficient: number;
  profit: number;
  loss: number;
  shortMarginStep: number;
  longMarginStep: number;
  marginDifference: number;
  longPrice: number;
  longMargin: number;
  longAllMargin: number;
  longPercent: number;
  shortMarginLimit: number;
  longMarginLimit: number;
  shortPrice: number;
  shortMargin: number;
  shortAllMargin: number;
  shortPercent: number;
  dateCreate: Date;
  dateUpdate: Date;
  notificationSending: boolean;
  sendNotification: boolean;
  criticalPercent: number;
  round: number;
  order: number;
  longLiquidatePrice: number;
  nextBuyLongPrice: number;
  criticalBuyLongPrice: number;
  nextBuyLongPriceWarning: boolean;
  criticalBuyLongPriceWarning: boolean;
  shortLiquidatePrice: number;
  nextBuyShortPrice: number;
  criticalBuyShortPrice: number;
  ordersCount: number;
  nextBuyShortPriceWarning: boolean;
  criticalBuyShortPriceWarning: boolean;
  sellShortPrice: number;
  sellShortPriceWarning: boolean;
  sellLongPrice: number;
  sellLongPriceWarning: boolean;
  autoAddLongMargin: boolean;
  autoAddShortMargin: boolean;
}
