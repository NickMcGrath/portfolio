import React from 'react';
import Grid from '@material-ui/core/Grid';
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
    this.handleInputChangeX1 = this.handleInputChangeX1.bind(this)
    this.handleInputChangeX2 = this.handleInputChangeX2.bind(this)
    this.handleSliderChange = this.handleSliderChange.bind(this)
  }

  handleSliderChange = (event, newValue) => {
    this.props.onChange([newValue[0], newValue[1]])
  };

  handleInputChangeX1 = (event) => {
    this.props.onChange([event.target.value === '' ? '' : Number(event.target.value), this.props.x2])
  };
  handleInputChangeX2 = (event) => {
    this.props.onChange([this.props.x1, event.target.value === '' ? '' : Number(event.target.value)])
  };


  render() {
    const {classes} = this.props;
    const x1 = this.props.x1, x2 = this.props.x2, min = this.props.min, max = this.props.max
    return (
      <div className={classes.root}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Input
              className={classes.input}
              value={x1}
              margin="dense"
              onChange={this.handleInputChangeX1}
              onBlur={this.props.onBlur}
              inputProps={{
                step: (max - min) * .1,
                min: min,
                max: max,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
          <Grid item xs>
            <Slider
              value={[x1, x2]}
              onChange={this.handleSliderChange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={min}
              max={max}
              onBlur={this.props.onBlur}
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={x2}
              margin="dense"
              onChange={this.handleInputChangeX2}
              onBlur={this.props.onBlur}
              inputProps={{
                step: (max - min) * .1,
                min: min,
                max: max,
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