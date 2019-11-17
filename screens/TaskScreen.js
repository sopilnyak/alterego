import React from 'react';
import {StyleSheet, ScrollView, SafeAreaView, AsyncStorage, View, TouchableOpacity, Text} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { RNS3 } from 'react-native-s3-upload';
import { NavigationEvents, withNavigationFocus } from 'react-navigation';

class TaskScreen extends React.Component {
  render() {
    const { isFocused } = this.props;
    if (isFocused) {
      setTimeout(() => this.takePicture(), 300)
      return (
          <SafeAreaView style={styles.safeArea}>
              <RNCamera
                  ref={ref => {
                      this.camera = ref;
                  }}
                  type={RNCamera.Constants.Type.front}
                  style={{
                      flex: 1,
                      width: '100%',
                  }}
              >
              </RNCamera>
          </SafeAreaView>
      );
    } else {
      return <View/>
    }
  }

  takePicture = async () => {
    if (this.camera) {
        let data = await this.camera.takePictureAsync({quality: 0.5, fixOrientation: true});
        this.uploadImage(data.uri);
    }
  }

  uploadImage(imageUri) {
    const filename = imageUri.replace(/^.*[\\\/]/, "");
    const file = {
      uri: imageUri,
      name: `${filename}`,
      type: "image/jpg"
    };

    const options = {
      bucket: "junction-alterego",
      region: "eu-north-1",
      accessKey: '',
      secretKey: '',
      successActionStatus: 201
    };
    RNS3.put(file, options)
      .then(response => {
        if (response.status === 201) {
            let url = `https://s3.eu-north-1.amazonaws.com/junction-alterego/${file.name}`;
            this.getFeatures(url);
        } else {
            alert(response.text);
        }
      })
  }

  getFeatures = async (imageUrl) => {
    let rootUrl = 'https://alterego.cognitiveservices.azure.com/face/v1.0/detect';
    let subscriptionKey = '7d963cbd3c954dfbb490de7b5f712a70';

    let url = `${rootUrl}?returnFaceAttributes=age,emotion`;
    let xhr = new XMLHttpRequest();
    xhr.onload = xhr.onerror = () => {
      if (xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);
        if (response.length > 0) {
            this.writeToStorage({
                'age': response[0].faceAttributes.age,
                'emotion': response[0].faceAttributes.emotion
            }).then(() => this.props.navigation.navigate('Home') );
            this.updateStatistics();
        } else {
          this.props.navigation.navigate('Home');
        }
      } else {
        alert("Error: " + xhr.responseText);
      }
    };
    xhr.open("POST", url, true /* async */);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    let data = '{"url": ' + '"' + imageUrl + '"}';
    xhr.send(data);
  }

  getModelValue(emotion) {
    let weights = {}
    weights['anger'] = -2;
    weights['contempt'] = 0;
    weights['disgust'] = 0;
    weights['fear'] = -4;
    weights['happiness'] = +1;
    weights['neutral'] = 0;
    weights['sadness'] = -2;
    weights['surprise'] = 0;
    let total = 0;
    for (let key in emotion) {
      if (emotion.hasOwnProperty(key)) {
        total += weights[key] * emotion[key];
      }
    }
    return total + 5;
  }

  writeToStorage = async (features) => {
    const value = await AsyncStorage.getItem('records').then(val =>
        JSON.parse(val),
    );
    let currentValue = {
      datetime: Date().toString(),
      value: this.getModelValue(features.emotion)
    };
    let newValue;
    if (value !== null) {
        newValue = value
        newValue.push(currentValue);
    } else {
        newValue = [currentValue];
    }
    await AsyncStorage.setItem('records', JSON.stringify([...newValue]));
  }

  updateStatistics = async () => {
    
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    width: '100%'
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  container: {
      flex: 1,
      width: '100%'
  },
});

export default withNavigationFocus(TaskScreen);
