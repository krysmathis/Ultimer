/*
    Adopted from https://www.npmjs.com/package/react-native-simple-time-picker
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Picker,
  View,
  StyleSheet,
  Text
} from 'react-native';

const styles = StyleSheet.create({
  component: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  picker: {
    flex: 1,
    margin: 0,
    padding: 0
  },
  label: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    margin: 30
  },
  labelBar: {
    display: 'flex',
    justifyContent: 'center',
  }
});

const MAX_HOURS = 60;
const MAX_MINUTES = 60;

export default class MyTimePicker extends Component {
  static propTypes = {
    selectedMinutes: PropTypes.number,
    selectedSeconds: PropTypes.number,
    onChange: PropTypes.func,
    hoursUnit: PropTypes.string,
    minutesUnit: PropTypes.string,
  }

  static defaultProps = {
    selectedMinutes: 0,
    selectedSeconds: 0,
    onChange: null,
    hoursUnit: '',
    minutesUnit: '',
  }

  constructor(props) {
    super(props);
    const { selectedMinutes, selectedSeconds } = props;
    this.state = {
      selectedMinutes,
      selectedSeconds,
    };
  }

  getHoursItems = () => {
    const items = [];
    const { hoursUnit } = this.props;
    for (let i = 0; i <= MAX_HOURS; i++) {
      items.push(
        <Picker.Item key={i} value={i} label={`${i.toString()}${hoursUnit}`} />,
      );
    }
    return items;
  }

  getMinutesItems = () => {
    const items = [];
    const { minutesUnit } = this.props;
    for (let i = 0; i <= MAX_MINUTES; i++) {
      items.push(
        <Picker.Item key={i} value={i} label={`${i.toString()}${minutesUnit}`} />,
      );
    }
    return items;
  }

  handleChangeHours = (itemValue) => {
    const { onChange } = this.props;
    this.setState({
      selectedMinutes: itemValue,
    }, () => {
      const { selectedMinutes, selectedSeconds } = this.state;
      onChange(selectedMinutes, selectedSeconds);
    });
  }

  handleChangeMinutes = (itemValue) => {
    const { onChange } = this.props;
    this.setState({
      selectedSeconds: itemValue,
    }, () => {
      const { selectedMinutes, selectedSeconds } = this.state;
      onChange(selectedMinutes, selectedSeconds);
    });
  }

  render() {
    const { selectedMinutes, selectedSeconds } = this.state;
    return (
      <View style={styles.component}>
        <View style={styles.container}>
          <Picker
            style={styles.picker}
            selectedValue={selectedMinutes}
            onValueChange={(itemValue) => this.handleChangeHours(itemValue)}
            > 
            {this.getHoursItems()}
          </Picker>
          <View style={styles.labelBar}>
            <Text style={styles.label}>minutes</Text>
          </View>
          <Picker
            style={styles.picker}
            selectedValue={selectedSeconds}
            onValueChange={(itemValue) => this.handleChangeMinutes(itemValue)}
            >
            {this.getMinutesItems()}
          </Picker>
          <View style={styles.labelBar}>
            <Text style={styles.label}>seconds</Text>
          </View>
            
        </View>
      </View>
    );
  }
}
