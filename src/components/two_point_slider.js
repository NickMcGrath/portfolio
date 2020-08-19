import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import {withStyles} from '@material-ui/styles';

const styles = theme => ({
  // root: {
  //   width: 250,
  // },
  input: {
    width: '3em',
  },
});

class TwoPointInputSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x1: props.x1,
      x2: props.x2,
      min: props.min,
      max: props.max,
      onBlur: props.onBlur
    }
  }

  handleSliderChange = (event, newValue) => {
    this.setState({
      x1: newValue[0],
      x2: newValue[1]
    })
  };

  handleInputChangeX1 = (event) => {
    this.setState({
      x1: event.target.value === '' ? '' : Number(event.target.value)
    })

  };
  handleInputChangeX2 = (event) => {
    this.setState({
      x2: event.target.value === '' ? '' : Number(event.target.value)
    })

  };
  getValues(){
    return [this.state.x1, this.state.x2]
  }


  handleBlur = () => {
    this.setState((state) => {
      let x1 = state.x1, x2 = state.x2
      if (x1 > x2)
        [x1, x2] = [x2, x1]
      if (x1 < state.min)
        x1 = state.min
      else if (x2 > state.max)
        x2 = state.max
      return {x1: x1, x2: x2}
    }, this.state.onBlur(this.state))
  };

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h6">
          Range
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Input
              className={classes.input}
              value={this.state.x1}
              margin="dense"
              onChange={this.handleInputChangeX1}
              onBlur={this.handleBlur}
              inputProps={{
                step: (this.state.max - this.state.min) * .1,
                min: this.state.min,
                max: this.state.max,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
          <Grid item xs>
            <Slider
              value={[this.state.x1, this.state.x2]}
              onChange={this.handleSliderChange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={this.state.min}
              max={this.state.max}
              onBlur={this.handleBlur}
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={this.state.x2}
              margin="dense"
              onChange={this.handleInputChangeX2}
              onBlur={this.handleBlur}
              inputProps={{
                step: (this.state.max - this.state.min) * .1,
                min: this.state.min,
                max: this.state.max,
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

export default withStyles(styles)(TwoPointInputSlider);