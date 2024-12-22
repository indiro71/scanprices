import currencyFormatter from 'currency-formatter';

export const convertPrice = (price, code = 'RUB') => {
  if (!price) return;
  return currencyFormatter.format(price, { code });
};
