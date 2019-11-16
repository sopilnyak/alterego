import React from 'react';
import {StyleSheet, ScrollView, SafeAreaView} from 'react-native';

class TestScreen extends React.Component {
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
  }
}

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

export default TestScreen;
