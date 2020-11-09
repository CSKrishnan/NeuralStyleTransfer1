// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DisplayImage from './screens/DisplayImage';
import SelectImage from './screens/SelectImage';

const Stack = createStackNavigator();

class App extends React.Component {  
  render(){
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen options={{headerShown: false}} name="Home" component={SelectImage} />
            <Stack.Screen options={{headerShown: false}} name="ApplyStyle" component={DisplayImage}/>        
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
}
export default App;

//headerTransparent:true,headerTitleStyle: { color: 'white' },headerTintColor:'white'