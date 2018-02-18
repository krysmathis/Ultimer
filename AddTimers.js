import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';


class AddTimersScreen extends React.Component {
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
        }
        // handle the binding of the input forms 'this' is available
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        
    }

    componentWillMount = () => {

        const { params } = this.props.navigation.state;
        const _title = params ? params.title : '';
        const _time = params ? params.time : '';
        const _updateMode = params ? params.updateMode : false;
        const _id = params ? params.id : null;
        
        this.setState({
            title: _title,
            time: _time,
            id: _id,
            updateMode: _updateMode

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
        
        console.log("params: ", params);
        console.log("HandleSubmit: ", this.props);
        console.log('Checking for null ', this.state);

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

    render() {
        
        
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.row}>
                <TextInput style={styles.nameInput} type="text" placeholder="Name" name="title" label="Timer Name" value={this.state.title} onChangeText={this.handleNameChange} />
                <TextInput style={styles.input} type="text" placeholder="Time" name="time" label="Time Limit" value={this.state.time} onChangeText={this.handleTimeChange} />
            </View>
            <TouchableOpacity
                  style = {styles.submitButton}
                  // onPress = {this.handleSubmit}>
                  onPress = {this.handleSubmit}>
               <Text style = {styles.submitButtonText}> Submit </Text>
             </TouchableOpacity>
            
        </View>
        );
    }
}

export default AddTimersScreen;

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