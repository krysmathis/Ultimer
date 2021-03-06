import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  FormLabel, FormInput,
  TouchableOpacity, Picker, FlatList,
  NavigatorIOS,
  AsyncStorage,
  Overlay,
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import TimerList from './TimerList.js';
import { StackNavigator, TabNavigator } from 'react-navigation';
// import the screens
import AddTimerScreen from './AddTimer';

// uuid Generatory
const uuidGenerator = function* () {
  while (true) {
      let time = new Date().getTime()
      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
          const random = (time + Math.random() * 16) % 16 | 0
          return (char === 'x' ? random : (random & 0x3 | 0x8)).toString(16)
      })
      yield uuid
  }
}

// Create instance of generator
const TimerId = uuidGenerator()

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});




class TimerContainerScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      storedTimers: [],
      showTimers: false,
      showForm: false,
      isLoading: true,
      title: "",
      time: "",
      id: "",
      updateMode: false,
    }
    // handle the binding of the input forms 'this' is available
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  static navigationOptions = {
    title: 'Home',
  };
  // Updating the record of when the user logs in
  componentWillMount(){
    
    //check async storage and if there are records there add them to the list
    // key will be timers value will be an array of timers with a list of id
    // create an array to store the timers
    let localTimers = []
    // create a new timer
    
    // get the timers from async storage
    AsyncStorage.getItem("timers").then((value) => {
        
        this.setState({
          storedTimers: JSON.parse(value),
          isLoading: false
        });

    }).done();

  }
  
  // Send data up to the database
  handlePost = (name, time) => {
    
    let timerArray = [];

    AsyncStorage.getItem("timers").then((value) => {
      
      // handle the situation where there are no existing timers
      if (value === null) {
        timerArray = [];
      } else {        
        // parse the value into a javascript array - sli
        timerArray = JSON.parse(value); 
      }

        // new timer
        const newTimer = {
          key: TimerId.next().value,
          name: name,
          limit: time
        }
        // push to array
        timerArray.push(newTimer);

        // store it again
        AsyncStorage.setItem("timers", JSON.stringify(timerArray)).then((r) => {
          
          this.setState({
            storedTimers: timerArray,
            updateMode: false
          });
    
        }).done();
        
      }).done();
  }

  handlePut = (id, title, time) => {

    const name = title;
    const limit = time;

    AsyncStorage.getItem("timers").then((value) => {
      
      // parse the value
      timerArray = JSON.parse(value);

      // pull the old timer and update it
      const index = timerArray.findIndex(i => i.key === id);
      
      timerArray[index].name = name;
      timerArray[index].limit = limit;

        // store it again
        AsyncStorage.setItem("timers", JSON.stringify(timerArray)).then((r) => {
          
          this.setState({
            storedTimers: timerArray,
            updateMode: false
          });
    
        }).done();
        
      }).done();

  
  }
 
  // remove the 
  handleDelete = (id) => {
    
    // pull the timers from async storage
    AsyncStorage.getItem("timers").then((value) => {
      
      // parse the array value
      timerArray = JSON.parse(value);

      // pull the old timer and update it
      const index = timerArray.findIndex(i => i.key === id);
      
      timerArray.splice(index,1);

        // store it again
        AsyncStorage.setItem("timers", JSON.stringify(timerArray)).then((r) => {
          
          this.setState({
            storedTimers: timerArray,
            updateMode: false
          });
    
        }).done();
        
      }).done();

  }

  handleUpdate = (timerObj) => {
    
    // navigate to add timers and pass in the necessary props
    this.props.navigation.navigate('AddTimer', {
      updateMode: true,
      title: timerObj.title,
      time: timerObj.time,
      id: timerObj.id,
      handlePut: this.handlePut
    });

  }
  
  // tied to the name input
  handleNameChange = (text) => {
    this.setState({title: text});
  }
  
  // tied to the time input
  handleTimeChange = (text) => {
    this.setState({time: text});
  }
  
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  
  generateTimers() {
    return <TimerList timers={this.state.storedTimers} delete={this.handleDelete} update={this.handleUpdate}/>
  }

  displayForm() {  
    /*
    iOS uses TextInput fields to hold data input
    */
    return (
        <View style={styles.main}>            
  
              <TouchableOpacity
                  style = {styles.submitButton}
                  // onPress = {this.handleSubmit}>
                  onPress = {() => this.props.navigation.navigate('AddTimer',{
                    handlePost: this.handlePost,
                    title: this.state.name,
                    time: this.state.time
                  })}>
               <Text style = {styles.submitButtonText}> Add New </Text>
             </TouchableOpacity>
            
        </View>
          
    );
  }
  
  
  render() {
    return (
      <View style={styles.container}>        
        { this.displayForm() }
        { this.state.isLoading === true ? <Text>Loading...</Text> : this.generateTimers() }
      </View>
    );
  }
}

const RootStack = StackNavigator (
  {
    Home: {
      screen: TimerContainerScreen,
    },
    AddTimer: {
      screen: AddTimerScreen,
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default class App extends React.Component {
  render() {
  return (<RootStack title="hello"/>);
  }
}

const styles = StyleSheet.create({
  main: {
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 50
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  navigation: {
    flex: 2,
    backgroundColor: 'black'
  },
  container: {
    paddingTop: 23
  },
  input: {
      margin: 15,
      height: 40,
      borderColor: 'black',
      borderBottomWidth: 2,
      width: 125
  },
  submitButton: {
      backgroundColor: 'black',
      padding: 10,
      margin: 15,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', 
  },
  submitButtonText:{
   
      color: 'white'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50
  },
  nameInput: {
    margin: 15,
      height: 40,
      borderColor: 'black',
      borderBottomWidth: 2,
      width: 175
  }
});
