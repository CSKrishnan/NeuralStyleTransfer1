import React, { Component, useState, useEffect,useRef} from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image,
    ImageBackground,
    FlatList,
    TouchableHighlight,
    SafeAreaView,
    Alert, 
    Button, 
    TouchableOpacity,
    ScrollView,
    PermissionsAndroid,
    Platform,
    StatusBar,
} from 'react-native';
import {Data} from './styleImages';
import {Icon,Header} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {captureRef} from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Share from 'react-native-share';


const DisplayImage = (props) => {
    const viewRef=useRef();
    const [uriImage, setUrlImage] = useState(props.route.params.uri)
    const [styleImage, setStyleImage] = useState(null)
    const [uriImageBase64, setUrlImageBase64] = useState(null)
    const [styleImageBase64, setStyleImageBase64] = useState(null)
    const [checkState,setCheckState]=useState(false)
    const [spinner,setSpinner]=useState(false)
    const getPermissionAndroid = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Image Download Permission',
              message: 'Your permission is required to save images to your device',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
          }
          Alert.alert(
            '',
            'Your permission is required to save images to your device',
            [{text: 'OK', onPress: () => {}}],
            {cancelable: false},
          );
        } catch (err) {
          // handle error as you please
          console.log('err', err);
        }
      };
      const downloadImage = async () => {
        try {
          // react-native-view-shot caputures component
          const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 0.8,
          });
    
          if (Platform.OS === 'android') {
            const granted = await getPermissionAndroid();
            if (!granted) {
              return;
            }
          }
    
          // cameraroll saves image
          const image = CameraRoll.save(uri, 'photo');
          if (image) {
            Alert.alert(
              '',
              'Image saved successfully.',
              [{text: 'OK', onPress: () => {}}],
              {cancelable: false},
            );
          }
        } catch (error) {
          console.log('error', error);
        }
      };
      const shareImage = async () => {
        try {
          // capture component 
          const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 0.8,
          });
    
          // share
          const shareResponse = await Share.open({url: uri});
        } catch (error) {
          console.log('error', error);
        }
      };

    function fetchImageBase64 (imageUrl) {
        return fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            }))
    }
 
    useEffect(() => {
        if (uriImage) {
            fetchImageBase64(uriImage).then(response => {
                setUrlImageBase64(response)
            })
            .catch(error => alert(error.message));
        }
    }, [uriImage])

    useEffect(() => {
        if (styleImage) {
            fetchImageBase64(styleImage).then(response => {
                setStyleImageBase64(response);    
            })
            .catch(error => alert(error.message));
        }
    }, [styleImage])

    useEffect(() => {
        if (uriImageBase64 && styleImageBase64) {
            sendStylizeRequest();
        }
    }, [uriImageBase64,styleImageBase64])
   
    const sendStylizeRequest = () => {
        const formData = new FormData();
        formData.append('contentImage', uriImageBase64);
        formData.append('styleImage', styleImageBase64);
        formData.append('savename', 'testIOS.jpg');
        fetch('http://10.0.2.2:5000/baseImages', {
          method: 'POST',
          body: formData
        })
            .then(response => response.text())
            .then(result => {
                console.log("****************************************",result)
                console.log("Style Transfer Complete!");
                setCheckState(true)
                setSpinner(false)
                setStyleImage(null)
                setStyleImageBase64(null)
            })
            .catch(error => { console.log('Error-->: ',JSON.stringify(error) )
            }); 
      }
      const renderItem = ({ item }) => {
        return (
            <View>
                <TouchableHighlight style={styles.item}
                    onPress={()=>{
                        setSpinner(true);
                        setStyleImage(item.sourc);
                    }}
                    >
                    <ImageBackground source={{uri:item.sourc}} style={{width: 120, height: 120}}>
                        <View style={styles.viewStyle}>
                            <Text style={styles.imageText}>{item.name}</Text>
                        </View>
                    </ImageBackground>
                </TouchableHighlight>
            </View>
        );
      };
      const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              'React Native | A framework for building native apps using React',
            url:"file://D:/ReactNativeFlask/MyTestApp/images/testIOS.jpg"
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
            } 
            else {
            }
          } else if (result.action === Share.dismissedAction) {
          }
        } catch (error) {
          alert(error.message);
        }
      };

        return(
            <View style={styles.container}>
                <Header
                    
                    placement="left"
                    centerComponent={{ text: 'Stylize', style: { color: '#fff',fontWeight:'bold' } }}
                    rightComponent={
                        <View style={{flexDirection:'row'}}>
                            <View style={{paddingRight:20}}>
                                <Icon
                                name='share'
                                type='material'
                                color='#fff'
                                onPress={shareImage}
                            />
                            </View>
                            <View>
                                <Icon
                                    name='save'
                                    type='material'
                                    color='#fff'
                                    onPress={downloadImage} />
                            </View>
                       </View> 
                    }
                    containerStyle={{
                        backgroundColor: '#159',
                        justifyContent: 'space-around',
                      }}
                    />
                    <View style={styles.savedComponent} ref={viewRef}>
                 {checkState?
                    <Image
                        source={require('../images/testIOS.jpg')}
                        style={{height:475,width:410}}
                        />:<Image
                source={{uri:uriImageBase64}}
                style={{height:475,width:410}}
                 />}
                 </View>

                  <Spinner
                    visible={spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                    />

                <SafeAreaView style={styles.bottomView}>
                    <FlatList
                        style={styles.container}
                        data={Data}
                        renderItem={renderItem}
                        horizontal={true}
                        keyExtractor={(item) => item.name}
                    />
                </SafeAreaView>
            </View>
        );
    }

    const styles = StyleSheet.create({
        item: {
            padding: 3,
        },
        container:{
            flex:1
        },
        bottomView: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
          },
          savedComponent: {
            backgroundColor: 'white',
            marginBottom: 30,
          },
        imageText:{
            fontSize:18,
            backgroundColor:'rgba(52, 52, 52, 0.5)',
            color:'white',
            width:120,
            textAlign:'center'
        },
        viewStyle:{
            position: 'absolute',
            bottom: 0, 
            justifyContent: 'flex-end', 
            alignItems: 'center'
        },
        spinnerTextStyle: {
            color: '#FFF'
          }
      });
      
export default DisplayImage