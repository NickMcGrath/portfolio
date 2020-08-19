import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import {withStyles} from "@material-ui/styles";

const styles = theme => ({
  root: {
    // width: 250,
  },
  input: {
    width: '3em'
  }
});

class SinglePointSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      onBlur: props.onBlur
    }
  }


  handleSliderChange(event, newValue) {
    this.setState({value: newValue})
  };

  handleInputChange(event) {
    this.setState({value: event.target.value === '' ? '' : Number(event.target.value)})
  };

  handleBlur() {
    this.setState(state => {
      let value = state.value
      if (state.value < -1)
        value = -1
      else if (state.value > 100)
        value = 100
      return {value: value}
    }, this.state.onBlur(this.state))
  }
  getValue(){
    return this.state.value
  }
  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Typography variant="h6">
          Multiplier
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={this.state.value}
              onChange={this.handleSliderChange.bind(this)}
              aria-labelledby="input-slider"
              valueLabelDisplay="auto"
              min={-1}
              max={100}
              onBlur={this.handleBlur.bind(this)}
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={this.state.value}
              margin="dense"
              onChange={this.handleInputChange.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              inputProps={{
                step: 3,
                min: -1,
                max: 100,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(SinglePointSlider);
