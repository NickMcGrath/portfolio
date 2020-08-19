import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import TwoPointInputSlider from "./two_point_slider";
import SinglePointSlider from "./single_point_slider";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/styles";
import Container from "@material-ui/core/Container";

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
    this.state = {
      elements: props.elements,
      mainSelectedIndex: 0,
      subSelectedIndex: 0,
      mainSelected: props.elements[0],
      subSelected: props.elements[0].subEntries[0]
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

  getMultiplierSliderData(data) {
    //this does a shallow assign and should be refactored
    // let updatedState = Object.assign({}, this.state)
    // updatedState.subSelected.multiplier = data.value
    // this.setState(updatedState)
    this.setState(state => {
      state.subSelected.multiplier = data.value})
  }

  getRangeSliderData(data) {
    //this does a shallow assign and should be refactored
    // let updatedState = Object.assign({}, this.state)
    // updatedState.subSelected.x1 = data.x1
    // updatedState.subSelected.x2 = data.x2
    // this.setState(updatedState)
    this.setState(state => {
      state.subSelected.x1 = data.x1
      state.subSelected.x2 = data.x2})
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

  onSubmit() {
    let elements = []
    for (let i = 0; i < this.state.elements.length; i++) {
      for (let j = 0; j < this.state.elements[i].subEntries.length; j++) {
        if (JSON.stringify(this.state.elements[i].subEntries[j]) !== JSON.stringify(this.defaultElements[i].subEntries[j])) {
          elements.push(this.state.elements[i].subEntries[j])
        }
      }
    }
    console.log(elements)
  }
}

export default withStyles(styles)(PortfolioScreenerForm)