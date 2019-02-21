import React, { Component } from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import Chart from './Chart';

const styles = theme => ({
    root: {
        width: '100%',
    },
    details: {
        flexDirection: "column"
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class Dashboard extends Component {
    state = {
        menuDemographics: false,
        menuEnvironment: false,
        ready: true,
        searchString: '',
        ages: ['0-17', '18-54', '55+'],
        age: 'all',
        gender: 'all',
        model: 'all'
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleChecked = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleClick = () => {
        this.setState(state => ({ menuDemographics: !state.menuDemographics }));
    };

    onSearchInputChange = (event) => {
        if (event.target.value) {
            this.setState({searchString: event.target.value})
        } else {
            this.setState({searchString: ''})
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid container spacing={24} style={{padding: 24}}>
                <Grid item xs={12} sm={6} lg={4} xl={3}>
                    <form className={classes.root} autoComplete="off">
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Demographics</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <Typography>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                    sit amet blandit leo lobortis eget.
                                </Typography>
                                <TextField style={{padding: 24}}
                                           id="searchInput"
                                           placeholder="Search for ___"
                                           margin="normal"
                                           onChange={this.onSearchInputChange}
                                />
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="age-simple">Age</InputLabel>
                                    <Select
                                        value={this.state.age}
                                        onChange={this.handleChange('age')}
                                        inputProps={{
                                            name: 'age',
                                            id: 'age-simple',
                                        }}
                                    >
                                        <MenuItem value="all">
                                            <em>All</em>
                                        </MenuItem>
                                        <MenuItem value={10}>0-17</MenuItem>
                                        <MenuItem value={20}>18-54</MenuItem>
                                        <MenuItem value={30}>55+</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormLabel component="legend">Gender</FormLabel>
                                    <RadioGroup
                                        aria-label="Gender"
                                        name="gender1"
                                        className={classes.group}
                                        value={this.state.gender}
                                        onChange={this.handleChange('gender')}
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="all" control={<Radio />} label="Any" />
                                    </RadioGroup>
                                </FormControl>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Environment</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="model-simple">MRI Machine Model</InputLabel>
                                    <Select
                                        value={this.state.model}
                                        onChange={this.handleChange('model')}
                                        inputProps={{
                                            name: 'model',
                                            id: 'model-simple',
                                        }}
                                    >
                                        <MenuItem value="all">
                                            <em>All</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Siemens</MenuItem>
                                        <MenuItem value={20}>A</MenuItem>
                                        <MenuItem value={30}>B</MenuItem>
                                    </Select>
                                </FormControl>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </form>
                </Grid>
                <Grid item xs={12} sm={6} lg={8} xl={9}>
                    <Chart/>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Dashboard);
