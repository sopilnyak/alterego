import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from './screens/HomeScreen';
import TestScreen from './screens/TestScreen';

const AppNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title: "Home",
      },
    },
    Tests: {
      screen: TestScreen,
      navigationOptions: {
        title: "Tests",
      },
    },
  },
  {
    initialRouteName: 'Home',
    backBehavior: 'initialRoute',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let IconComponent = FontAwesome5;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'Tests') {
          iconName = 'list-alt';
        }
        return (
          <IconComponent name={iconName} size={25} color={tintColor} />
        );
      },
    }),
    tabBarOptions: {
      activeBackgroundColor: '#F9F9F9',
      inactiveBackgroundColor: '#F9F9F9',
      activeTintColor: '#F15A3F',
      inactiveTintColor: '#848d96',
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <AppContainer />;
  }
}
