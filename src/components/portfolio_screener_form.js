import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import TwoPointInputSlider from "./two_point_slider";
import SinglePointSlider from "./single_point_slider";

const styles = theme => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center"
  }
});

class PortfolioScreenerForm extends React.Component {
  constructor(props) {
    super(props)
    //I dont like this because of its un-intuitiveness but Object.assign only creates a shallow copy
    this.defaultElements = JSON.parse(JSON.stringify(props.elements));
    this.elements = props.elements
    this.state = {
      mainSelectedIndex: 0,
      subSelectedIndex: 0,
      mainSelected: this.elements[0],
      subSelected: this.elements[0].subEntries[0]
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <Container>
        <Grid container width={1}>
          <Grid item xs={4}>
            <Typography variant="h6">Main Options</Typography>
            <List>
              {this.elements.map((item, index) => {
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
            <Typography variant="h6">
              Range
            </Typography>
            <TwoPointInputSlider
              x1={this.state.subSelected.setMin}
              x2={this.state.subSelected.setMax}
              min={this.state.subSelected.min}
              max={this.state.subSelected.max}
              onChange={this.handleRangeSliderData.bind(this)}
              onBlur={this.handleRangeSliderBlur.bind(this)}/>
            <Typography variant="h6">
              Multiplier
            </Typography>
            <SinglePointSlider
              value={this.state.subSelected.multiplier}
              onChange={this.handleMultiplierChange.bind(this)}
              onBlur={this.handleMultiplierBlur.bind(this)}
            />
          </Grid>
        </Grid>
        <div className={classes.center}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Icon>send</Icon>}
            onClick={this.onSubmit.bind(this)}>
            Send
          </Button>
        </div>
      </Container>

    )
  }

  handleMultiplierChange(value) {
    let updatedSubSelected = Object.assign({}, this.state.subSelected)
    updatedSubSelected.multiplier = value
    this.setState({subSelected: updatedSubSelected})
    this.updateSubSelected(updatedSubSelected)
  }

  handleRangeSliderData(data) {
    let updatedSubSelected = Object.assign({}, this.state.subSelected)
    updatedSubSelected.setMin = data[0]
    updatedSubSelected.setMax = data[1]
    this.setState({subSelected: updatedSubSelected})
    this.updateSubSelected(updatedSubSelected)
  }

  handleMultiplierBlur() {
    let value = this.state.subSelected.multiplier
    if (value < -1)
      value = -1
    else if (value > 100)
      value = 100
    this.handleMultiplierChange(value)
  }

  handleRangeSliderBlur() {
    let setMin = this.state.subSelected.setMin, setMax = this.state.subSelected.setMax
    if (setMin > setMax)
      [setMin, setMax] = [setMax, setMin]
    if (setMin < this.state.subSelected.min)
      setMin = this.state.subSelected.min
    else if (setMax > this.state.subSelected.max)
      setMax = this.state.subSelected.max

    this.handleRangeSliderData([setMin, setMax])
  }

  updateSubSelected(updatedSubSelected) {
    this.elements[this.state.mainSelectedIndex].subEntries[this.state.subSelectedIndex] = updatedSubSelected
  }

  onMainSelection(index) {
    if (index !== this.state.mainSelectedIndex) {
      this.setState({
        mainSelectedIndex: index,
        mainSelected: this.elements[index],
        subSelectedIndex: 0,
        subSelected: this.elements[index].subEntries[0]
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

  onSubmit() {
    let values = ['apiKey', 'setMin', 'setMax', 'multiplier']
    let elements = []
    for (let i = 0; i < this.elements.length; i++) {
      for (let j = 0; j < this.elements[i].subEntries.length; j++) {
        if (JSON.stringify(this.elements[i].subEntries[j]) !== JSON.stringify(this.defaultElements[i].subEntries[j])) {
          let value = {}
          for(let valueKey of values)
            value[valueKey] = this.elements[i].subEntries[j][valueKey]
          elements.push(value)
        }
      }
    }
    console.log(elements)
    fetch('http://localhost:5000/ScreenerCriteria', {
      method: 'POST',
      // mode: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(elements)
    }).then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.log(error))


  }
}

export default withStyles(styles)(PortfolioScreenerForm)