import { Currency } from "../contexts/currency";
import axios from "axios";

export type ExchangeHistory = {
  base: Currency;
  start_date: string;
  end_date: string;
  rates: {
    [key: string]: {
      [currency in Currency]: number;
    };
  };
};

export const getExchangeHistory = async (
  from: Currency,
  to: Currency,
  start: string,
  end: string
): Promise<ExchangeHistory> => {
  const apikey = process.env.EXCHANGE_APY_KEY;
  const response = await axios.get<ExchangeHistory>(
    `https://api.apilayer.com/exchangerates_data/timeseries?base=${from}&symbols=${to}&start_date=${start}&end_date=${end}`,
    {
      headers: {
        apikey,
      },
    }
  );

  return response.data;
};
