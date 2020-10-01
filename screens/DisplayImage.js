import React, { Component, useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image,ImageBackground,FlatList,TouchableHighlight,SafeAreaView} from 'react-native';
import {Data} from './styleImages';
import Spinner from 'react-native-loading-spinner-overlay';

const DisplayImage = (props) => {
    const [uriImage, setUrlImage] = useState(props.route.params.uri)
    const [styleImage, setStyleImage] = useState(null)
    const [uriImageBase64, setUrlImageBase64] = useState(null)
    const [styleImageBase64, setStyleImageBase64] = useState(null)
    const [checkState,setCheckState]=useState(false)
    const [spinner,setSpinner]=useState(false)

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
                console.log("*******************=============",result)
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

        return(
            <View style={styles.container}>
                 {checkState?
                    <Image
                        source={require('../images/testIOS.jpg')}
                        style={{height:470,width:410}}
                        />:<Image
                source={{uri:uriImageBase64}}
                style={{height:470,width:410}}
                 />}
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