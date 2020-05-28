/*
  this is an Application of a calculator 
  code made by : Muhammed Abdelhamid
*/

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      resultText: '',
      finalResult: ''
    }
  }


  onPressed(text) {

    let operators = ['+', '-', 'X', '/']
    let result = this.state.resultText
    if (text == '=') {
      if (operators.includes(result.slice(-1)) || (result.slice(-1) == '.')) { return } // validate last char is not operator or [.]
      else { return this.caculateResult() }
    }

    /* some validations on the string to make sure all is correct syntax */
    if (operators.includes(text)) {
      if (this.state.finalResult != '') { return this.anotherOperation(text) } // for beginning of new calculations
    }
    if (result.length == 0) {
      if (operators.includes(text) || text == 0) { text = '' }    // to prevent operators or zeros at beginning 
      if (text == '.') { text = '0.' }                               // for good shape
    }
    else if (operators.includes(result.slice(-1))) {
      if (operators.includes(text)) { text = '' }                  // to prevent operators repetion
      else if (text == 0) { text = '' }                            // to prevent 0 after an operator
    }
    else if (result.slice(-1) == '.') {
      if (operators.includes(text)) { text = '0' + text }           // for good shape
    }
    else if (text == '.') {
      // for loop to prevent cases like 5.3.4
      for (let i = result.length - 1; i >= 0; --i) {
        if (operators.includes(result[i])) { break }
        else if (result[i] == ".") { text = '' }
      }
    }
    if (result[result.length - 1] == ".") { if (text == '.') { text = '' } } //prevent 5...3 cases

    this.setState({
      resultText: this.state.resultText + text
    })
  }

  anotherOperation(text) {
    this.setState({
      resultText: this.state.finalResult + text,
      finalResult: ''
    })
  }

  caculateResult() {
    let text = this.state.resultText

    // now parse text and calculate 
    text = this.parseText('X', '/', text) // parse for * and / first 
    text = this.parseText('+', '-', text) // then + and -

    // we actually do not need to do this while we have an eval() function can do for us  

    this.setState({
      finalResult: text
      // finalResult : eval(text)
    })

  }

  parseText(firstSign, secondSign, text) {
    let operators = ['+', '-', 'X', '/']
    let index
    while (text.indexOf(firstSign) != -1 || text.indexOf(secondSign) != -1) {
      let indexOne = text.indexOf(firstSign),
        indexTwo = text.indexOf(secondSign)
      if (indexOne == -1) { index = indexTwo }
      else if (indexTwo == -1) { index = indexOne }
      else { index = (indexOne < indexTwo) ? indexOne : indexTwo }
      let sign = text.charAt(index)
      let firstNum = '', secondNum = '', char = '', trim = '', replace = ''
      for (let i = index - 1; i >= 0; --i) {
        char = text.charAt(i)
        if (operators.includes(char)) { break }
        else { firstNum = char + firstNum }
      }
      for (let i = index + 1; i < text.length; ++i) {
        char = text.charAt(i)
        if (operators.includes(char)) { break }
        else { secondNum = secondNum + char }
      }
      trim = firstNum + sign + secondNum
      replace = this.calculate(firstNum, secondNum, sign)
      text = text.replace(trim, replace)
    }
    return text
  }

  calculate(firstNum, secondNum, sign) {
    let R
    switch (sign) {
      case 'X':
        R = parseFloat(firstNum) * parseFloat(secondNum)
        break
      case '/':
        R = parseFloat(firstNum) / parseFloat(secondNum)
        break
      case '+':
        R = parseFloat(firstNum) + parseFloat(secondNum)
        break
      case '-':
        R = parseFloat(firstNum) - parseFloat(secondNum)
        break
    }
    return (R.toString())
  }


  startAgain() {
    this.setState({
      resultText: '',
      finalResult: ''
    })
  }

  render() {
    /*block of code to organize the shape of the keyboard */
    let boardView = []
    let elems = [[1, 2, 3, '+'], [4, 5, 6, '-'], [7, 8, 9, 'X'], ['=', 0, '.', '/']]
    for (let i = 0; i < 4; ++i) {
      let row = []
      for (let j = 0; j < 4; ++j) {
        row.push(<TouchableOpacity
          style={styles.keyboard}
          onPress={() => this.onPressed(elems[i][j])}
          key={j}>
          <Text style={styles.keyboardText}>{elems[i][j]}</Text>
        </TouchableOpacity>)
      }
      boardView.push(<View style={styles.keyboard}>{row}</View>);
    }

    /*block of code to differentiate colors of numbers and operators */

    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />

        <View style={styles.calculations}>
          <Text style={styles.calculations}>{this.state.resultText}</Text>
        </View>

        <View style={styles.results}>
          <Text style={styles.results}>{this.state.finalResult}</Text>
          <TouchableOpacity style={styles.AC}
            onPress={() => this.startAgain()}>
            <Text style={styles.keyboardText}>AC</Text>
          </TouchableOpacity>

        </View>

        {boardView}

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',  //white
  },
  statusBar: {
    backgroundColor: '#1E90FF', //blue
    height: 20
  },
  calculations: {
    flex: 3,
    backgroundColor: 'white', //light grey
    fontSize: 32,
    color: '#696969', //grey
    alignItems: 'flex-end'
  },
  results: {
    flex: 2,
    backgroundColor: '#1E90FF', //blue 
    fontSize: 26,
    color: 'white',
    alignItems: 'flex-end'
  },
  keyboard: {
    flex: 1.5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: '#1E90FF',
    borderWidth: .3,
    borderRadius: 3,
    flexDirection: 'row'
  },
  keyboardText: {
    fontSize: 32,
    color: '#1E90FF'
  },
  AC: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'

  }
});
