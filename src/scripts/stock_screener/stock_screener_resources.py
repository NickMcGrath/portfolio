# to start:
# venv\Scripts\activate
import json

import requests
import concurrent.futures
import threading
from datetime import date
import time
from apscheduler.schedulers.background import BackgroundScheduler
import logging
import pickle
import glob
import os

logging.basicConfig(level=logging.DEBUG)


def singleton(class_):
    instances = {}

    def get_instance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]

    return get_instance


class Stock:
    def __init__(self, overview):
        self.overview = overview

    @property
    def export(self):
        return {[{'Overview': self.overview}]}

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

    @classmethod
    def download_stock(cls, ticker):
        stock = requests.get(
            f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={ticker}&apikey={StockDownloader.api_key}')
        stock = stock.json()
        for k, v in stock.items():
            if cls._is_type(v, int):
                stock[k] = int(v)
            elif cls._is_type(v, float):
                stock[k] = float(v)
            elif v == 'true':
                stock[k] = True
            elif v == 'false':
                stock[k] = False
        time.sleep(cls.wait_sec)
        return Stock(overview=stock)

    """
    :return generator
    """

    @classmethod
    def download_stocks(cls, tickers, threads=threads):
        with concurrent.futures.ThreadPoolExecutor(
                max_workers=threads) as executor:
            stocks = executor.map(cls.download_stock, tickers)
            # executor.shutdown(wait=True)
        return stocks


class StockFileManager:
    file_path = 'stock_pickles/'
    file_name = 'stock_list_'  # followed by date
    file_suffix = '.pkl'
    lock = threading.Lock()

    @classmethod
    def read(cls, the_date: date) -> [Stock]:
        stock_list = []
        with cls.lock:
            with open(cls.file_path + cls.file_name + the_date.isoformat() + cls.file_suffix,
                      'rb') as f:
                while True:
                    try:
                        stock_list.append(pickle.load(f))
                    except EOFError:
                        break
        return stock_list

    @classmethod
    def write(cls, stock):
        with cls.lock:
            with open(cls.file_path + cls.file_name + date.today().isoformat() + cls.file_suffix,
                      'ab') as f:
                pickle.dump(stock, f)

    @classmethod
    def get_most_recent_date(cls) -> date:
        pickle_list = glob.glob(cls.file_path + "*")
        recent_file = max(pickle_list, key=os.path.getctime)
        recent_file_date_str = os.path.basename(recent_file).replace(cls.file_name, '').replace(cls.file_suffix, '')
        return date.fromisoformat(recent_file_date_str)

    @classmethod
    def read_most_recent(cls) -> [Stock]:
        return cls.read(cls.get_most_recent_date())

    @classmethod
    def is_empty_folder(cls):
        if len(os.listdir(cls.file_path)) == 0:
            return True
        else:
            return False


@singleton
class StockDownloadManager:

    def __init__(self, stock_list):
        scheduler = BackgroundScheduler()
        scheduler.add_job(self.update_current_list, 'cron', day_of_week='mon-fri', hour=20, minute=4)
        scheduler.start()
        self.stock_list = stock_list
        self.stock_list_update_callbacks = []

    def add_list_update_callback(self, stock_list_update_callback):
        self.stock_list_update_callbacks.append(stock_list_update_callback)

    def update_current_list(self):
        if StockFileManager.is_empty_folder() or StockFileManager.get_most_recent_date() < date.today():
            for stock in StockDownloader.download_stocks(self.stock_list):
                self.stock_list.append(stock)
                StockFileManager.write(stock)

            for callback in self.stock_list_update_callbacks:
                callback()
        else:
            self.stock_list = StockFileManager.read(date.today())


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


# for testing
def main():
    # test_stock_list = StockDownloader().download_stocks(['f', 'msft'])
    # for stock in test_stock_list:
    #     logging.debug(stock)
    #     StockFileManager.write(stock)
    #
    # logging.debug('most recent: ' + str(StockFileManager.read_most_recent()))
    ticker_list = ['msft', 'f', 'aapl']
    dm = StockDownloadManager(ticker_list)
    logging.debug(dm.stock_list)
    dm.update_current_list()
    logging.debug(dm.stock_list)


if __name__ == '__main__':
    main()
