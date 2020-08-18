import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import TwoPointInputSlider from "./components/two_point_slider";
import SinglePointSlider from "./components/single_point_slider";
import Typography from "@material-ui/core/Typography";


class MainSelectionTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      elements: props.elements,
      mainSelectedIndex: 0,
      subSelectedIndex: 0,
      mainSelected: props.elements[0],
      subSelected: props.elements[0].subEntries[0]
    }
  }

  render() {
    return (
      <Grid container width={1}>
        <Grid item xs={4}>
          <Typography variant="h6">Main Options</Typography>
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
          <Typography variant="h6">Sub Options</Typography>
          <List>
            {this.state.mainSelected.subEntries.map((item, index) => {
              return (
                <ListItem selected={this.state.subSelectedIndex === index} key={item.display}
                          onClick={(event) => this.onSubSelection(index)}>{item.display}</ListItem>)
            })}
          </List>
        </Grid>
        <Grid item xs={4} key={this.state.subSelected.apiKey}>
          <Typography variant="h6">Description</Typography>
          <Typography variant="body2">{this.state.subSelected.description}</Typography>
          <TwoPointInputSlider
            x1={this.state.subSelected.x1}
            x2={this.state.subSelected.x2}
            min={this.state.subSelected.min}
            max={this.state.subSelected.max}
            onBlur={this.getRangeSliderData.bind(this)}/>
          <SinglePointSlider
            value={this.state.subSelected.multiplier}
            onBlur={this.getMultiplierSliderData.bind(this)}
          />
        </Grid>
      </Grid>

    )
  }

  getMultiplierSliderData(data) {
    let updatedState = Object.assign({}, this.state)
    updatedState.subSelected.multiplier = data.value
    this.setState(updatedState)
  }

  getRangeSliderData(data) {
    let updatedState = Object.assign({}, this.state)
    updatedState.subSelected.x1 = data.x1
    updatedState.subSelected.x2 = data.x2
    this.setState(updatedState)
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
    if (index !== this.state.subSelectedIndex) {
      this.setState({
        subSelectedIndex: index,
        subSelected: this.state.mainSelected.subEntries[index],
      })
    }
  }
}

class PortfolioSettings
  extends React.Component {
  render() {
    let tableData = [
      {
        display: "display title",
        subEntries: [{
          display: "sub display",
          apiKey: "sub api key",
          description: "Hello I do this",
          min: 10,
          max: 100,
          x1: 10,
          x2: 90,
          multiplier: -1
        }, {
          display: "sub display two",
          apiKey: "sub api key two",
          description: "Hello I do that 2",
          min: -10,
          max: 100,
          x1: 10,
          x2: 90,
          multiplier: -1
        }]
      },
      {
        display: "display title two",
        subEntries: [{
          display: "sub display three",
          apiKey: "sub api key two",
          description: "Hello I do something 3",
          min: 5,
          max: 10,
          x1: 5,
          x2: 10,
          multiplier: -1
        }, {
          display: "sub display four",
          apiKey: "sub api key four",
          description: "Hello I do not sure 4",
          min: 1,
          max: 3,
          x1: 1,
          x2: 3,
          multiplier: -1
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
