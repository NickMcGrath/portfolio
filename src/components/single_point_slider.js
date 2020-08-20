import React from 'react';
import Grid from '@material-ui/core/Grid';
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
    this.handleSliderChange = this.handleSliderChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleSliderChange(event, newValue) {
    this.props.onChange(newValue)
  }

  handleInputChange(event) {
    this.props.onChange(event.target.value === '' ? '' : Number(event.target.value))
  }

  render() {
    const value = this.props.value
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={value}
              onChange={this.handleSliderChange}
              aria-labelledby="input-slider"
              valueLabelDisplay="auto"
              min={-1}
              max={100}
              // onBlur={this.handleBlur.bind(this)}
            />
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={value}
              margin="dense"
              onChange={this.handleInputChange}
              onBlur={this.props.onBlur}
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
