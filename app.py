from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from crawling import movies, get_movie_summary
import os
from math import ceil


app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['UPLOAD_FOLDER'] = "./static/profile_pics"

SECRET_KEY = 'SPARTA'

client = MongoClient('localhost', 27017)
db = client.dbsparta

@app.route('/')
def home():
    page_count = ceil(len(movies) / 20)
    
    token_receive = request.cookies.get('mytoken')
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        username = db.userscinema.find_one({"username":payload['id']})

        return render_template('index.html',  movie_list=movies[:20], page_count=page_count, username=username['username'])
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('log-in.html', msg=msg)

@app.route('/login/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(db.userscinema.find_one({"username": username_receive}))
    return jsonify({'result': 'success', 'exists': exists})

@app.route('/login/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,                               # 아이디
        "password": password_hash,                                  # 비밀번호
    }
    db.userscinema.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/page', methods=['GET'])
def page():
    page_count = ceil(len(movies) / 20)
    order = int(request.args.get('order'))
    
    return render_template('index.html', movie_list=movies[20 * order:20 * (order + 1)], page_count=page_count)

@app.route('/sign_in', methods=['POST'])
def sign_in():

    # 로그인
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']

    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.userscinema.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
         'id': username_receive,
         'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')
        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

@app.route('/detail', methods=['GET'])
def detail():
    code = int(request.args.get('code'))
    detail_info = get_movie_summary(code)

    get_grade = db.usersgrade.find_one({'code': code})
    grade = get_grade['grade'] if get_grade else 0

    return render_template('detail.html', detail_info=detail_info, grade=grade)

@app.route('/review', methods=['GET'])
def show_review():
    code = int(request.args.get('id'))
    review_list = list(db.usersreview.find({'code':code}, {'_id':False}))

    return jsonify({'review_list': review_list })

@app.route('/review/add', methods=['POST'])
def get_review():
    receive = request.get_json()
    review_list = list(db.usersreview.find({}, {'_id':False}))
    id = 0 if not review_list else int(max(review_list, key=lambda x: x['id'])['id']) + 1

    grade = {
        "code": receive['code'],
        "grade": receive['grade'],
        "count": 1
    }

    doc = {
        "code": receive['code'],
        "grade": receive['grade'],
        "comment": receive['comment'],
        "date": receive['date'],
        "id": id
    }

    get_grade = db.usersgrade.find_one({'code': receive['code']})
    send_grade = None

    if get_grade is None:
        db.usersgrade.insert_one(grade)
        send_grade = receive['grade']
    else:
        count = get_grade['count'] + 1
        send_grade = round((get_grade['grade'] * (count - 1) + receive['grade']) / count, 1)

        db.usersgrade.update_one({'code': receive['code']}, {'$set': {
            'grade': send_grade,
            'count': count
        }})

    db.usersreview.insert_one(doc)

    return jsonify({'result': 'success', 'id': doc['id'], 'total_grade': send_grade})

@app.route('/review/edit', methods=['POST'])
def edit_review():
    receive = request.get_json()
    grade = db.usersgrade.find_one({'code': receive['code']})
    count = grade['count'] - 1
    send_grade = None

    print(count)
    
    if count:
        send_grade = round((grade['grade'] * (count + 1) - receive['grade']) / count, 1)
    else:
        send_grade = 0

    db.usersgrade.update_one({'code': receive['code']}, {'$set': {
        'grade': send_grade,
        'count': count
    }})
    db.usersreview.delete_one({'id':int(receive['id'])})

    return jsonify({'result': 'success', 'total_grade': send_grade})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)