import React from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
// import theme from './theme'
import Slider from '@material-ui/core/Slider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import TwoPointInputSlider from "./components/two_point_slider";


class MainSelectionTable extends React.Component {
  constructor(props) {
    super(props)
    this.userChanges = {}
    this.state = {
      elements: props.elements,
      mainSelectedIndex: 0,
      subSelectionIndex: 0,
      mainSelected: props.elements[0],
      subSelected: props.elements[0].subEntries[0]
    }
  }

  render() {
    return (
      <Grid container width={1}>
        <Grid item xs={4}>
          <h5>Main Options</h5>
          <List>
            {this.state.elements.map((item, index) => {
              return (
                <ListItem selected={this.state.mainSelectedIndex === index}
                          key={item.display}
                          onClick={(event) => this.onMainSelection(index)}>{item.display}</ListItem>)
            })}
          </List>
        </Grid>
        <Grid item xs={4}>
          <h5>Sub Options</h5>
          <List>
            {this.state.mainSelected.subEntries.map((item, index) => {
              return (
                <ListItem selected={this.state.subSelectedIndex === index} key={item.display}
                          onClick={(event) => this.onSubSelection(index)}>{item.display}</ListItem>)
            })}
          </List>
        </Grid>
        <Grid item xs={4}>

          <div className="description">
            {this.state.subSelected.description}
          </div>
          <TwoPointInputSlider
            x1={1}
            x2={9}
            min={-10}
            max={100}
            onBlur={this.getSliderData.bind(this)}/>
        </Grid>
      </Grid>

    )
  }

  getSliderData(data) {
    console.log("bitch")
    console.log(data)
  }

  onMainSelection(index) {
    if (index !== this.state.mainSelectedIndex) {
      this.setState({
        mainSelectedIndex: index,
        mainSelected: this.state.elements[index],
        subSelectedIndex: 0,
        subSelected: this.state.elements[index].subEntries[0]
      })
    }


  }

  onSubSelection(index) {
    if (index !== this.state.subSelectedIndex)
      this.setState({
        subSelectedIndex: index,
        subSelected: this.state.mainSelected.subEntries[index]
      })
  }
}

class PortfolioSettings
  extends React.Component {
  render() {
    let tableData = [
      {
        display: "display title",
        subEntries: [{
          display: "sub display", apiKey: "sub api key", description: "Hello I do this"
        }, {
          display: "sub display two", apiKey: "sub api key", description: "Hello I do that 2"
        }]
      },
      {
        display: "display title two",
        subEntries: [{
          display: "sub display three", apiKey: "sub api key two", description: "Hello I do something 3"
        }, {
          display: "sub display four", apiKey: "sub api key", description: "Hello I do not sure 4"
        }]
      },
    ]
    return (
      <div>
        <CssBaseline/>
        <MainSelectionTable elements={tableData}/>
      </div>
    )
  }
}

export default function App() {
  return (
    <PortfolioSettings/>
  );
}
