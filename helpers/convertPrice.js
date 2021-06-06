import currencyFormatter from 'currency-formatter';

export const convertPrice = (price) => {
    if (!price) return;
    return currencyFormatter.format(price, { code: 'RUB' });
};