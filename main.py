#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import Flask, render_template, request
from flask_uploads import UploadSet, configure_uploads, ALL 
from gevent.wsgi import WSGIServer
import os

app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['UPLOADED_PHOTOS_DEST'] = app.static_folder


gg = UploadSet('test', ALL,
        default_dest=lambda app: app.static_folder)

configure_uploads(app, gg)

@app.route('/', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST' and 'upload' in request.files:
        filename = gg.save(request.files['upload'])
        full_path_file = '{}/{}'.format(app.static_folder, filename)
        dic = {}
        dic['data'] = []
        with open(full_path_file) as f:
            lines = f.readlines()
            for l in lines:
                print(l)
                tok = l.split('\n')[0]
                # 2017/05/31 12:30:15 15
                dic['data'].append(tok)
        #print(dic)
        # remove the file
        os.remove(full_path_file)
        return render_template('display.html', backend_data=dic)
    return render_template('index.html')

def run_server():
    http_server = WSGIServer(('', 8888), app)
    http_server.serve_forever()

if __name__ == '__main__':
    run_server()
