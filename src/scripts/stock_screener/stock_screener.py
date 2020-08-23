import sys
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


# to start:
# venv\Scripts\activate
# (venv) C:\Users\NickM\WebstormProjects\portfolio\src\scripts\stock_screener>set FLASK_APP=stock_screener.py
# (venv) C:\Users\NickM\WebstormProjects\portfolio\src\scripts\stock_screener>flask run --host=localhost

@app.route('/ScreenerCriteria', methods=['GET', 'POST'])
def stock_screener_route():
    data = request.get_json()
    print(request.data)
    print(request.headers)
    print(data)
    return jsonify(data)



