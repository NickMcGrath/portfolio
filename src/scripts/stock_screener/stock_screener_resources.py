# to start:
# venv\Scripts\activate
import json

import requests
import concurrent.futures
import threading
from datetime import datetime
import time
from apscheduler.schedulers.background import BackgroundScheduler


class Stock:
    def __init__(self, overview):
        self.overview = overview

    def export(self):
        return {self.overview['Symbol']: [{'Overview': self.overview}]}

    def __repr__(self):
        return str(
            f'{self.overview["Name"]}\nPE: {self.overview["PERatio"]} \nPEG: {self.overview["PEGRatio"]} \nPB: {self.overview["PriceToBookRatio"]}')
        # return str(self.overview)


class StockDownloader:
    api_key = 'RD00RWB9FWI79E6G'
    threads = 5
    wait_sec = 0

    @classmethod
    def _is_type(cls, x, t):
        try:
            t(x)
            return True
        except:
            return False

    def download_stock(self, ticker):
        stock = requests.get(
            f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={ticker}&apikey={StockDownloader.api_key}')
        stock = stock.json()
        for k, v in stock.items():
            if self._is_type(v, int):
                stock[k] = int(v)
            elif self._is_type(v, float):
                stock[k] = float(v)
            elif v == 'true':
                stock[k] = True
            elif v == 'false':
                stock[k] = False
        time.sleep(self.wait_sec)
        return Stock(overview=stock)

    """
    :return generator
    """

    def download_stocks(self, tickers, threads=threads):
        with concurrent.futures.ThreadPoolExecutor(
                max_workers=threads) as executor:
            stocks = executor.map(self.download_stock, tickers)
            # executor.shutdown(wait=True)
        return list(stocks)


class StockFileManager:
    file_name = 'stock_list'  # followed by date
    lock = threading.Lock()

    @classmethod
    def read(cls) -> [Stock]:
        with cls.lock:
            with open():
                pass

    @classmethod
    def write(cls, data):
        with cls.lock:
            with open(f'stock_list_{datetime.date(datetime.now())}.json', 'a') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)


# class Frequency(Enum):
#     INSTANT = 0,
#     SECOND = 1,
#     MINUTE = 60,
#     HOUR = 60*60,
#     HALF_DAY = 60*60*12,
#     DAY = 60*60*24
#     WEEK = 60*60*24*7
#     THIRTY_DAY = 60*60*24*31

def singleton(class_):
    instances = {}

    def get_instance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]

    return get_instance


@singleton
class StockDownloadManager:

    def __init__(self, stock_list_update_callback):
        scheduler = BackgroundScheduler()
        scheduler.add_job(self.update_current_list, 'cron', day_of_week='mon-fri', hour=20, minute=4)
        scheduler.start()
        self.stock_list = []
        self.stock_list_update_callbacks = [stock_list_update_callback]

    def update_current_list(self):
        pass


class StockSorter:
    def __init__(self):
        self.factory = StockDownloader()
        self.attribute_dict = {}

    def download_and_sort(self, tickers):
        values_to_sort = ['PERatio', 'PEGRatio', 'PriceToBookRatio']

        generator_stock_list = self.factory.download_stocks(tickers, threads=5)
        stock_list = []

        for stock in generator_stock_list:
            stock_list.append(stock)

        for key in values_to_sort:
            print(key)
            self.attribute_dict[key] = sorted(stock_list, key=lambda stock: stock.overview[key])
        print(self.attribute_dict)


test_stock_list = StockDownloader().download_stocks(['f', 'msft'])
test_export_list = [stock.export() for stock in test_stock_list]

fm = StockFileManager()
fm.write(test_export_list)
