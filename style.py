import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import PIL.Image
import matplotlib.pyplot as plt
 
name_count=50
def tensor_to_image(tensor):
    tensor = tensor*255
    tensor = np.array(tensor, dtype=np.uint8)
    if np.ndim(tensor)>3:
        assert tensor.shape[0] == 1
        tensor = tensor[0]
    return PIL.Image.fromarray(tensor)
 
 
def load_img(path_to_img):
    print("load img 1")
    img = tf.io.read_file(path_to_img)
    print("load img 2")
    img = tf.io.decode_image(img, channels=3)
    print("load img 1")
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = img[tf.newaxis, :]
    return img
 
def preprocess_image(image, target_dim):
      # Resize the image so that the shorter dimension becomes 256px.
    shape = tf.cast(tf.shape(image)[1:-1], tf.float32)
    short_dim = min(shape)
    scale = target_dim / short_dim
    new_shape = tf.cast(shape * scale, tf.int32)
    image = tf.image.resize(image, new_shape)
 
    # Central crop the image.
    image = tf.image.resize_with_crop_or_pad(image, target_dim, target_dim)
 
    return image
 
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
    print("hi********************************   sai   Krishnan")
    hub_handle = 'https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2'
    hub_module = hub.load(hub_handle)
    outputs = hub_module(tf.constant(content_image), tf.constant(style_image))
    stylized_image = outputs[0]
    converted_img = tensor_to_image((stylized_image))
    converted_img.save(savename)
    return converted_img