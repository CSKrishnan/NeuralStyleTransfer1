# Neural Style Transfer
This project is primarily a React-based mobile application with a backend Flask server that uses Artistic Style Transfer to stylize images using Convolutional Neural Networks. It has made use of Tensorflow for the MobileNetv2 model for the fast arbitrary image stylization and react-native for the development of the mobile application.

### Block diagram
<img src="https://github.com/CSKrishnan/NeuralStyleTransfer1/blob/master/images/blockdiagram.PNG" width="800" height="500">

### Requirements
* Tensorflow - v2.3
* Hub model - https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2
* react-native-cli - v2.0.1
* flask - v1.1.1

### To run the app:
* run the flask server
  * go to the root directory
  * execute `flask run --host=0.0.0.0`
* start the react-native application
  * go to the root directory
  * execute `react-native run-android --no-jetifier`
  
### Sample screenshot
![stylized image](https://github.com/CSKrishnan/NeuralStyleTransfer1/blob/master/images/sample.PNG)
 
 ### References
1.  Justin Johnson, Alexandre Alahi, Li Fei-Fei [“Perceptual Losses for Real-Time Style Transfer and Super-Resolution”](https://arxiv.org/abs/1603.08155)
2.  Leon A. Gatys, Alexander S. Ecker, Matthias Bethge [“A Neural Algorithm of Artistic Style”](https://arxiv.org/abs/1508.06576)
3.  [TFLite StyleTransfer using MobileNetV2](https://www.tensorflow.org/lite/models/style_transfer/overview)



