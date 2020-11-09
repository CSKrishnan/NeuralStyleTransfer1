from flask import Flask,jsonify
import json
import os
import matplotlib.pyplot as plt
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
from flask import send_file
from flask import render_template
from flask import request
from binascii import a2b_base64
import base64
from style import draw_image_stylized
 
app = Flask(__name__)
  
def convert_binary_to_image(filename, binary):
    fd = open(filename, 'wb')
    fd.write(binary)
    fd.close()
    print("convert bin")
 
def save(encoded_data, filename):
    nparr = np.fromstring(encoded_data.decode('base64'), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_ANYCOLOR)
    return cv2.imwrite(filename, img)
    
@app.route('/baseImages', methods=['POST'])
def upload_and_generate():
    if request.method == 'POST':
        content_image = request.form['contentImage']
        style_image = request.form['styleImage']
        draw_image_stylized(content_image, style_image, savename='images/' + request.form['savename'])
        print("hiwdqwwqewq")
        with open('images/' + request.form['savename'], 'rb') as image_file:
            encoded_image = base64.b64encode(image_file.read()) 
        encoded_image= str('data:image/jpeg;base64,')+encoded_image.decode('utf-8')
        return "encoded_image"