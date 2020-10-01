import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image,ImageBackground } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import img1 from '../images/img1.png';
import {Dimensions} from 'react-native';
 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class SelectImage extends React.Component {

  state = {resourcePath: {}}

 cameraLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (res) => {
 
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
        alert(res.customButton);
      } else {
        const source = { uri: res.uri };
        this.setState({
          filePath: res,
          fileData: res.data,
          fileUri: res.uri
        });
        this.props.navigation.navigate('ApplyStyle', {uri: res.uri} )
      }
    });
  }
 
  imageGalleryLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
 
    ImagePicker.launchImageLibrary(options, (res) => {
 
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
        alert(res.customButton);
      } else {
        const source = { uri: res.uri };
        this.setState({
          filePath: res,
          fileData: res.data,
          fileUri: res.uri
        });
        this.props.navigation.navigate('ApplyStyle', {uri: res.uri} )
 
      }
    });
  }  
 
  render() {
    return (
      <ImageBackground source={img1} style={styles.image}>
        <View style={styles.container}>
          
          <Text style={styles.textStyle}>Style It!</Text>

          <TouchableOpacity onPress={this.cameraLaunch} style={styles.button}  >
              <Text style={styles.buttonText}>Launch Camera</Text>
          </TouchableOpacity>
 
          <TouchableOpacity onPress={this.imageGalleryLaunch} style={styles.button}  >
              <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 250,
    height: 60,
    backgroundColor: '#3740ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    top:50,
    marginBottom:12    
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff'
  },
  textStyle:{
    fontSize:45,
    fontWeight:'bold',
    position:"absolute",
    color:'#990011FF',
    top:30
  },
  image: {
    flex: 1,
    height:windowHeight,
    width:windowWidth,
    justifyContent: "center"
  }
});
