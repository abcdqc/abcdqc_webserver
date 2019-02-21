import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Chart from './Chart';

class Dashboard extends Component {
    state = {
        ready: true,
        searchString: '',
        ages: ['0-17', '18-54', '55+']
    };

    onSearchInputChange = (event) => {
        if (event.target.value) {
            this.setState({searchString: event.target.value})
        } else {
            this.setState({searchString: ''})
        }
    };

    render() {
        return (
            <Grid container spacing={24} style={{padding: 24}}>
                <Grid item xs={12} sm={6} lg={4} xl={3}>
                    <TextField style={{padding: 24}}
                               id="searchInput"
                               placeholder="Search for ___"
                               margin="normal"
                               onChange={this.onSearchInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} lg={8} xl={9}>
                    <Chart/>
                </Grid>
            </Grid>
        );
    }
}

export default Dashboard;
