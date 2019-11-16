import React from 'react';
import {StyleSheet, ScrollView, SafeAreaView, DeviceEventEmitter, AppRegistry} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import invokeApp from 'react-native-invoke-app';

class HomeScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}>
        </ScrollView>
      </SafeAreaView>
    );
  }

  componentDidMount() {
    // BackgroundTimer.runBackgroundTimer(() => { 
    //     alert("Timer");
    //     }, 
    //     3000);
    //     BackgroundTimer.stopBackgroundTimer();
    DeviceEventEmitter.addListener('appInvoked', (data) => {
        alert(data);
	});
  }
}

const notificationActionHandler = async (data) => {
    invokeApp({
	    data: "Timer",
    })
}

AppRegistry.registerHeadlessTask(
    'RNPushNotificationActionHandlerTask', () => notificationActionHandler,
);

AppRegistry.registerComponent('testProject', () => appStack);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
