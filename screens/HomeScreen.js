import React from 'react';
import {StyleSheet, View, SafeAreaView, FlatList, Text, AsyncStorage} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Path, Circle, G, Image} from 'react-native-svg';
import {AreaChart, Grid, PieChart} from 'react-native-svg-charts';
import Assets from '../assets';
import * as shape from 'd3-shape';

class HomeScreen extends React.Component {
  state = {
    records: [],
    isGood: true,
  }
  render() {
    let icon;
    if (this.state.isGood) {
      icon = (
        <View style={styles.headerContainerGood}>
          <FontAwesome5
              name={'smile'}
              size={100}
              solid
              style={styles.icon}
              color={'#F9F9F9'}
            />
            <Text style={styles.headerGood}>Everything is OK!</Text>
        </View>
      );
    } else {
      icon = (
        <View style={styles.headerContainerBad}>
          <FontAwesome5
              name={'exclamation-triangle'}
              size={100}
              solid
              style={styles.icon}
              color={'#F9F9F9'}
            />
            <Text style={styles.headerBad}>Something wrong with you</Text>
        </View>
      );
    }

    const chartData = this.state.records;
    const isOk = this.state.isGood;

    const chartOkColor = ['rgb(100, 200, 100)', 'rgba(100, 200, 100, 0.2)'];
    const chartBadColor = ['rgb(200, 100, 0)', 'rgba(200, 100, 0, 0.2)'];

    // нейтральный не берем
    const pieNames = [
      'anger',
      'contempt',
      'disgust',
      'fear',
      'happiness',
      'sadness',
      'surprise',
    ];
    const pieData = [100, 200, 100, 150, 300, 50, 44];
    const pieBlocks = [
      {
        key: 0,
        amount: pieData[0],
        svg: {fill: '#ff4e33'},
      },
      {
        key: 1,
        amount: pieData[1],
        svg: {fill: '#9900cc'},
      },
      {
        key: 2,
        amount: pieData[2],
        svg: {fill: '#c61aff'},
      },
      {
        key: 3,
        amount: pieData[3],
        svg: {fill: '#c26910'},
      },
      {
        key: 4,
        amount: pieData[4],
        svg: {fill: '#99ff99'},
      },
      {
        key: 5,
        amount: pieData[5],
        svg: {fill: '#aaaaaa'},
      },
      {
        key: 6,
        amount: pieData[6],
        svg: {fill: '#ecb3ff'},
      },
    ];
    const Labels = ({slices, height, width}) => {
      return slices.map((slice, index) => {
        const {labelCentroid, pieCentroid, data} = slice;
        return (
          <G key={index} x={labelCentroid[0]} y={labelCentroid[1]}>
            <Circle r={18} fill={'white'} />
            <Image
              x={-10}
              y={-10}
              width={20}
              height={20}
              preserveAspectRatio="xMidYMid slice"
              opacity="1"
              href={Assets.memes[index]}
            />
          </G>
        );
      });
    };

    const Line = ({line}) => (
      <Path
        key={'line'}
        d={line}
        stroke={isOk ? chartOkColor[0] : chartBadColor[0]}
        fill={'none'}
      />
    );

    const ArgMax = array =>
      array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];

    return (
      <SafeAreaView style={styles.safeArea}>
        <NavigationEvents
          onWillFocus={payload => {
            this.getRecordsList();
            // setTimeout(() => {
            //   this.props.navigation.navigate('Photo');
            //   },
            //   7000);
          }
        } 
        />
        {icon}
        <AreaChart
          style={{height: 200}}
          data={chartData}
          contentInset={{top: 30}}
          curve={shape.curveNatural}
          svg={{fill: isOk ? chartOkColor[1] : chartBadColor[1]}}
          animate>
          <Grid />
          <Line />
        </AreaChart>
        <View
          style={{
            backgroundColor: '#f9f9f9',
            marginBottom: 15,
            alignItems: 'center',
          }}>
        </View>
        <PieChart
          style={{height: 200}}
          valueAccessor={({item}) => item.amount}
          data={pieBlocks}
          spacing={0}
          outerRadius={'95%'}>
          <Labels />
        </PieChart>
        <View
          style={{
            backgroundColor: '#f9f9f9',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <Text>
            Most frequent: {pieNames[ArgMax(pieData)]} (
            {pieData[ArgMax(pieData)]}%)
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#fab900',
            padding: 5,
            marginTop: 20,
          }}>
          <Text>If you need help, call the helpline: +7 (800) 555-35-35!</Text>
        </View>
      </SafeAreaView>
    );
  }

  componentWillCreate() {
    // setTimeout(() => {
    //   this.props.navigation.navigate('Photo');
    //   },
    //   2000);
  }

  getRecordsList = async () => {
    const value = await AsyncStorage.getItem('records').then(val =>
      JSON.parse(val),
    );
    if (value !== null) {
      let array = Array.from(value.map(item => {return item.value}));
      let limit = 4;
      if (array.length > 3 && array[array.length - 1] < limit &&
        array[array.length - 2] < limit && array[array.length - 3] < limit) {
        this.setState({isGood: false});
      } else {
        this.setState({isGood: true});
      }
      this.setState({records: array});
    }
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollView: {
  },
  headerContainerGood: {
    flex: 1,
    backgroundColor: '#8bc34a',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainerBad: {
    flex: 1,
    backgroundColor: '#f44336',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 2,
  },
  icon: {
    marginBottom: 10
  },
  headerGood: {
    fontSize: 32,
    color: '#F9F9F9'
  },
  headerBad: {
    marginTop: 5,
    fontSize: 25,
    color: '#F9F9F9'
  },
});

export default HomeScreen;
