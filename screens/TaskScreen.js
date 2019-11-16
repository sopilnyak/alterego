import React from 'react';
import {StyleSheet, ScrollView, SafeAreaView, AsyncStorage, View, TouchableOpacity, Text} from 'react-native';
import { RNCamera } from 'react-native-camera';
import {ImageResizer} from 'react-native-image-resizer';

class TaskScreen extends React.Component {
  render() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{
                    flex: 1,
                    width: '100%',
                }}
            >
            </RNCamera>
        </SafeAreaView>
    );
  }

  componentDidMount() {
      setTimeout(() => this.takePicture(), 500);
  }

  componentDidUpdate() {
    setTimeout(() => this.takePicture(), 500);
  }

  takePicture = async () => {
    if (this.camera) {
        let data = await this.camera.takePictureAsync({base64: true}).then((data) => {
            ImageResizer.createResizedImage(data.path, 300, 300, 'JPEG', 100)
            .then(uri => {
                return uri;
            }
            )});
        this.getFeatures(data.base64);
    }
  }

  getFeatures = async (imageBase64) => {
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
            });
            this.updateStatistics();
        }
      } else {
        alert("Error: " + xhr.responseText);
      }
    };
    xhr.open("POST", url, true /* async */);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    let data = '{"url": ' + '"' + imageBase64 + '"}';
    xhr.send(data);
  }

  writeToStorage = async (features) => {
    const value = await AsyncStorage.getItem('records').then(val =>
        JSON.parse(val),
    );
    let currentValue = {};
    currentValue[Date().toString()] = features;
    let newValue;
    if (value !== null) {
        newValue = value.push(currentValue);
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

export default TaskScreen;
