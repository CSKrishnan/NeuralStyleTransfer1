import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import PIL.Image
import matplotlib.pyplot as plt
import cv2
 
name_count=50
style_predict_path = tf.keras.utils.get_file('style_predict.tflite', 'https://tfhub.dev/google/lite-model/magenta/arbitrary-image-stylization-v1-256/int8/prediction/1?lite-format=tflite')
style_transform_path = tf.keras.utils.get_file('style_transform.tflite', 'https://tfhub.dev/google/lite-model/magenta/arbitrary-image-stylization-v1-256/int8/transfer/1?lite-format=tflite')

def tensor_to_image(tensor):
    tensor = tensor*255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor)>3:
        assert tensor.shape[0] == 1
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)
 
 
def load_img(path_to_img):
    img = tf.io.read_file(path_to_img)
    img = tf.io.decode_image(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = img[tf.newaxis, :]
    return img
 
def preprocess_image(image, target_dim):
    shape = tf.cast(tf.shape(image)[1:-1], tf.float32)
    short_dim = min(shape)
    scale = target_dim / short_dim
    new_shape = tf.cast(shape * scale, tf.int32)
    image = tf.image.resize(image, new_shape)
    image = tf.image.resize_with_crop_or_pad(image, target_dim, target_dim)
    return image
def run_style_predict(preprocessed_style_image):
    interpreter = tf.lite.Interpreter(model_path=style_predict_path)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    interpreter.set_tensor(input_details[0]["index"], preprocessed_style_image)
    interpreter.invoke()
    style_bottleneck = interpreter.tensor(interpreter.get_output_details()[0]["index"])()
    return style_bottleneck

def run_style_transform(style_bottleneck, preprocessed_content_image):
    interpreter = tf.lite.Interpreter(model_path=style_transform_path)

    input_details = interpreter.get_input_details()
    interpreter.allocate_tensors()
    interpreter.set_tensor(input_details[0]["index"], preprocessed_content_image)
    interpreter.set_tensor(input_details[1]["index"], style_bottleneck)
    interpreter.invoke()
    stylized_image = interpreter.tensor(interpreter.get_output_details()[0]["index"])()
    return stylized_image


def draw_image_stylized(content_img, style_img, savename):
    global name_count
    name_count+=1
    content_name='content'+str(name_count)+'.jpg'
    style_name='style'+str(name_count)+'.jpg'
    content_image=tf.keras.utils.get_file(content_name,content_img)
    style_image=tf.keras.utils.get_file(style_name,style_img)
    content_image = load_img(content_image)
    style_image = load_img(style_image)
    preprocessed_content_image = preprocess_image(content_image, 384)

    preprocessed_style_image = preprocess_image(style_image, 256)
    style_bottleneck = run_style_predict(preprocessed_style_image)
    stylized_image = run_style_transform(style_bottleneck, preprocessed_content_image)

    style_bottleneck_content = run_style_predict(preprocess_image(content_image, 256))
    content_blending_ratio = 0.5 
    style_bottleneck_blended = content_blending_ratio * style_bottleneck_content + (1 - content_blending_ratio) * style_bottleneck
    stylized_image_blended = run_style_transform(style_bottleneck_blended,preprocessed_content_image)

    converted_img = tensor_to_image((stylized_image_blended))
    converted_img.save(savename)
    print('completed')
    return converted_img