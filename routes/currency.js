import express from 'express';
import axios from 'axios';
export const currencyRouter = express.Router();

const API_URL = 'http://api.nbp.pl/api/exchangerates/tables/a/';

currencyRouter.get('/currencyData', async (req, res) => {
  try {
    let data = axios.get(API_URL);
    let currency = await Promise.all([data]);
    const allCurrencies = currency[0].data[0].rates;
    allCurrencies.push({
      currency: 'Polski złoty',
      code: 'PLN',
      mid: 1.0,
    });
    const filterXDR = allCurrencies.filter((element) => element.code !== 'XDR');
    res.status(200).send({
      success: 'true',
      message: 'currencies',
      currencies: filterXDR,
    });
    res.end();
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
});
