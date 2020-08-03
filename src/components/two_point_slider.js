import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import {withStyles} from '@material-ui/styles';

const styles = theme => ({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
});

class TwoPointInputSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x1: props.x1,
      x2: props.x2
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

  handleBlur = () => {
    if (this.state.x1 < this.props.min) {
      this.setState({x1: this.props.min}, () => {
        this.props.onBlur(this.state)
      })
    } else if (this.state.x2 > this.props.max) {
      this.setState({x2: this.props.max}, () => {
        this.props.onBlur(this.state)
      })
    } else {
      this.props.onBlur(this.state)
    }
  };

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <Typography id="input-slider" gutterBottom>
          Volume
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
                step: (this.props.max - this.props.min) * .1,
                min: this.props.min,
                max: this.props.max,
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
              min={this.props.min}
              max={this.props.max}
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
                step: (this.props.max - this.props.min) * .1,
                min: this.props.min,
                max: this.props.max,
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