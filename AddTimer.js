import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Picker
} from 'react-native';
import MyTimePicker from './MyTimePicker';
 



class AddTimerScreen extends React.Component {
    static navigationOptions = {
        title: 'Create or Update Timers',
    };

    constructor(props) {
            super(props);

            this.state = {
                isLoading: true,
                title: "",
                time: "",
                id: "",
                updateMode: false,
                selectedMinutes: 0,
                selectedSeconds: 0,
        }
        // handle the binding of the input forms 'this' is available
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        
    }

    getSecondsAfterMinutesRemoved = (seconds) => {
        const minutes = (Math.floor((parseInt(seconds))/60));
        const minutesToSeconds = minutes * 60;
        return parseInt(seconds) - minutesToSeconds;
    }
    componentWillMount = () => {

        const { params } = this.props.navigation.state;
        const _title = params ? params.title : '';
        const _time = params ? params.time : '';
        const _updateMode = params ? params.updateMode : false;
        const _id = params ? params.id : null;
        const _selectedMinutes = params ? Math.floor((parseInt(params.time)/60)) : 0;
        const _selectedSeconds = params ? this.getSecondsAfterMinutesRemoved(parseInt(params.time)) : 0;
        
        this.setState({
            title: _title,
            time: _time,
            id: _id,
            updateMode: _updateMode,
            selectedMinutes: _selectedMinutes,
            selectedSeconds: _selectedSeconds
        });
    }
      
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // tied to the name input
    handleNameChange = (text) => {
        this.setState({title: text});
    }
    
    // tied to the time input
    handleTimeChange = (text) => {
        this.setState({time: text});
    }

    // Preparing the data for the post request
    handleSubmit = () => {
        
        const { params } = this.props.navigation.state;
        const handlePost = params ? params.handlePost : null;
        const handlePut = params ? params.handlePut : null;
        

        if (this.state.title !== undefined && this.state.time !== undefined){
            if ( this.state.title.length > 0 & this.isNumeric(this.state.time)) {
            // handle post or update
            if (this.state.updateMode === true) {
                handlePut(this.state.id, this.state.title, this.state.time);
            } else {
                handlePost(this.state.title, this.state.time);
            }
        }

        this.setState({
            title: "",
            time: ""
        });

        this.props.navigation.goBack();
        }

    }

    timePickerChange = (minutes, seconds) => {
        
        const _minutes = minutes ? minutes : "0";
        const _seconds = seconds ? seconds : "0";

        this.setState({
            time: ((parseInt(_minutes) * 60) + parseInt(_seconds)).toString()
        });
    }

    render() {
        
        selectedMinutes = this.state.selectedMinutes;
        selectedSeconds = this.state.selectedSeconds;

        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Enter a name and select a time</Text>
            <View style={styles.row}>
                <TextInput  style={styles.nameInput} type="text" placeholder="Name" name="title" label="Timer Name" value={this.state.title} onChangeText={this.handleNameChange} />
            </View>
             <MyTimePicker
                selectedMinutes={selectedMinutes}
                selectedSeconds={selectedSeconds}
                onChange={(minutes, seconds) => this.timePickerChange(minutes,seconds)}
                />
            <TouchableHighlight
                  style = {styles.submitButton}
                  // onPress = {this.handleSubmit}>
                  onPress = {this.handleSubmit}>
               <Text style = {styles.submitButtonText}> Submit </Text>
             </TouchableHighlight>

        </View>
        );
    }
}

export default AddTimerScreen;

const styles = StyleSheet.create({
    main: {
      backgroundColor: 'white'
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
        width: '100%',
        padding: 10,
        margin: 15,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
    },
    submitButtonText:{
        flex: 1,
        color: 'white'
    },
    row: {
    
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 30,
      marginTop: 50
      
    },
    nameInput: {
        borderColor: 'black',
        borderBottomWidth: 1,
        fontSize: 24,
        width: '100%'
    }
  });