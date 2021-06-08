from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from crawling import get_movie_info
import os
from math import ceil

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'


app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

client = MongoClient('localhost', 27017)
db = client.dbsparta

movie_list = get_movie_info()   
page_count = ceil(len(movie_list) / 20)

@app.route('/')
def home():
    return render_template('index.html', movie_list=movie_list[:20], page_count=page_count)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/login')
def login():
    return render_template('log-in.html')

@app.route('/login', methods=['POST'])
def sign_up():
    # 회원가입
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    # DB에 저장
    return jsonify({'result': 'success'})

@app.route('/login/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})

@app.route('/page', methods=['GET'])
def page():
    order = int(request.args.get('order'))

    return render_template('index.html', movie_list=movie_list[20 * order:20 * (order + 1)], page_count=page_count)

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
