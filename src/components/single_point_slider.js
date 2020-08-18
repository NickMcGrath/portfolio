import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import {withStyles} from "@material-ui/styles";

const styles = theme => ({
  // root: {
  //   width: 250,
  // },
  // input: {
  //   width: 42,
  // },
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
    let newValue = (event.target.value === '' ? '' : Number(event.target.value));
    this.setState({value: newValue})
  };

  handleBlur() {
    if (this.state.value < -1) {
      this.setState({value: -1}, () => {
        this.state.onBlur(this.state)
      })
    } else if (this.state.value > 100) {
      this.setState({value: 100}, () => {
        this.state.onBlur(this.state)
      })
    } else {
      this.state.onBlur(this.state)
    }
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
