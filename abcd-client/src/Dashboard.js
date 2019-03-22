import React, { Component } from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chart from './Chart';

const optsModality = ['T1w', 'T2w', 'bold'];
const optsIqm = {};
optsIqm.T1w = ['cjv', 'cnr', 'efc', 'fber', 'fwhm_avg',
    'fwhm_x', 'fwhm_y', 'fwhm_z', 'icvs_csf', 'icvs_gm', 'icvs_wm',
    'inu_med', 'inu_range', 'qi_1', 'qi_2', 'rpve_csf', 'rpve_gm',
    'rpve_wm', 'size_x', 'size_y', 'size_z', 'snr_csf', 'snr_gm',
    'snr_total', 'snr_wm', 'snrd_csf', 'snrd_gm', 'snrd_total', 'snrd_wm',
    'spacing_x', 'spacing_y', 'spacing_z', 'summary_bg_k', 'summary_bg_mad',
    'summary_bg_mean', 'summary_bg_median', 'summary_bg_n',
    'summary_bg_p05', 'summary_bg_p95', 'summary_bg_stdv', 'summary_csf_k',
    'summary_csf_mad', 'summary_csf_mean', 'summary_csf_median',
    'summary_csf_n', 'summary_csf_p05', 'summary_csf_p95',
    'summary_csf_stdv', 'summary_gm_k', 'summary_gm_mad', 'summary_gm_mean',
    'summary_gm_median', 'summary_gm_n', 'summary_gm_p05', 'summary_gm_p95',
    'summary_gm_stdv', 'summary_wm_k', 'summary_wm_mad', 'summary_wm_mean',
    'summary_wm_median', 'summary_wm_n', 'summary_wm_p05', 'summary_wm_p95',
    'summary_wm_stdv', 'tpm_overlap_csf', 'tpm_overlap_gm',
    'tpm_overlap_wm', 'wm2max'];
optsIqm.T2w = ['cjv', 'cnr', 'efc', 'fber', 'fwhm_avg',
    'fwhm_x', 'fwhm_y', 'fwhm_z', 'icvs_csf', 'icvs_gm', 'icvs_wm',
    'inu_med', 'inu_range', 'qi_1', 'qi_2', 'rpve_csf', 'rpve_gm',
    'rpve_wm', 'size_x', 'size_y', 'size_z', 'snr_csf', 'snr_gm',
    'snr_total', 'snr_wm', 'snrd_csf', 'snrd_gm', 'snrd_total', 'snrd_wm',
    'spacing_x', 'spacing_y', 'spacing_z', 'summary_bg_k', 'summary_bg_mad',
    'summary_bg_mean', 'summary_bg_median', 'summary_bg_n',
    'summary_bg_p05', 'summary_bg_p95', 'summary_bg_stdv', 'summary_csf_k',
    'summary_csf_mad', 'summary_csf_mean', 'summary_csf_median',
    'summary_csf_n', 'summary_csf_p05', 'summary_csf_p95',
    'summary_csf_stdv', 'summary_gm_k', 'summary_gm_mad', 'summary_gm_mean',
    'summary_gm_median', 'summary_gm_n', 'summary_gm_p05', 'summary_gm_p95',
    'summary_gm_stdv', 'summary_wm_k', 'summary_wm_mad', 'summary_wm_mean',
    'summary_wm_median', 'summary_wm_n', 'summary_wm_p05', 'summary_wm_p95',
    'summary_wm_stdv', 'tpm_overlap_csf', 'tpm_overlap_gm',
    'tpm_overlap_wm', 'wm2max'];
optsIqm.bold = ['dummy_trs', 'dvars_nstd',
    'dvars_std', 'dvars_vstd', 'efc', 'fber', 'fd_mean', 'fd_num',
    'fd_perc', 'fwhm_avg', 'fwhm_x', 'fwhm_y', 'fwhm_z', 'gcor', 'gsr_x',
    'gsr_y', 'provenance__settings__fd_thres', 'size_t', 'size_x', 'size_y',
    'size_z', 'snr', 'spacing_tr', 'spacing_x', 'spacing_y', 'spacing_z',
    'summary_bg_k', 'summary_bg_mad', 'summary_bg_mean',
    'summary_bg_median', 'summary_bg_n', 'summary_bg_p05', 'summary_bg_p95',
    'summary_bg_stdv', 'summary_fg_k', 'summary_fg_mad', 'summary_fg_mean',
    'summary_fg_median', 'summary_fg_n', 'summary_fg_p05', 'summary_fg_p95',
    'summary_fg_stdv', 'tsnr'];

const optsManualQC = ['True', 'False'];

const optsManufacturer = ['GE', 'Philips', 'Siements'];
const optsManufacturerModel = {};
optsManufacturerModel.GE = [
    'DISCOVERY_MR750',
    'Ingenia',
    'SIGNA Creator'
];
optsManufacturerModel.Philips = [
    'Archieva dStream'
];
optsManufacturerModel.Siemens = [
    'Prisma',
    'Prisma fit'
];
const optsRun = [1, 2, 3, 4, 5];
const optsTask = ['mid', 'nback', 'rest', 'sst'];

const styles = theme => ({
    root: {
        width: '100%',
    },
    details: {
        flexDirection: 'column'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: theme.typography.fontWeightRegular,
    },
    margin: {
        margin: theme.spacing.unit,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class Dashboard extends Component {
    state = {
        datas: [],
        age: 'all',
        iqm: optsIqm['T1w'].concat(),
        manualQC: 'all',
        manufacturer: 'all',
        modality: 'T1w',
        model: 'all',
        run: 'all',
        sex: 'all',
        splitX: '',
        splitViolin: '',
        task: 'all',
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value }, () => this.load());
    };

    handleChecked = name => event => {
        this.setState({ [name]: event.target.checked }, () => this.load());
    };

    iqmAll = () => {
        this.setState({iqm: optsIqm[this.state.modality].concat()}, () => this.load());
    };

    iqmNone = () => {
        this.setState({iqm: []}, () => this.load());
    };

    copyState = () => {
        return {
            age: this.state.age,
            iqm: this.state.iqm,
            manualQC: this.state.manualQC,
            manufacturer: this.state.manufacturer,
            modality: this.state.modality,
            model: this.state.model,
            run: this.state.run,
            sex: this.state.sex,
            splitX: this.state.splitX,
            splitViolin: this.state.splitViolin,
            task: this.state.task,
        }
    };

    load = () => {
        const SEP = '___';
        const VAL = '-';
        function kv(key, value) {
            return key + VAL + value;
        }
        function addKv(file, key, value) {
            if (value) {
                file.name += SEP + kv(key, value);
            }
        }

        if (!this.state.modality) {
            return;
        }
        let file = {};

        file.name = kv('Modality', this.state.modality);
        addKv(file, 'Manufacturer', this.state.manufacturer);
        addKv(file, 'Model', this.state.model);
        addKv(file, 'Task', this.state.task);
        addKv(file, 'QC', this.state.manualQC);
        addKv(file, 'Sex', this.state.sex);
        const state = this.copyState();

        fetch('/data/v0.1/' + file.name + '.json', {mode: 'no-cors'})
            .then(res => res.json())
            .then(res => {
                this.processData(state, res)
            })
            .catch(error => {this.processData(state, {}); console.log("Fetch error: ", error)});
    };

    processData = (state, res) => {
        this.setState(state => ({
            datas: state.iqm
                .filter(iqm => !!this.state.iqm.includes(iqm) && !!res[iqm])
                .map(iqm => ({iqm: iqm, data: [Object.assign({key: 'x split'}, res[iqm])]}))
        }));
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid container spacing={24} style={{padding: 24}}>
                <Grid item xs={12} sm={6} md={5} lg={4} xl={3}>
                    <form className={classes.root} autoComplete='off'>
                        <Typography className={classes.heading}>Filter</Typography>
                        <FormControl className={classes.root} style={{marginBottom: '10px'}}>
                            <InputLabel htmlFor='modality'>Modality</InputLabel>
                            <Select value={this.state.modality}
                                    onChange={this.handleChange('modality')}
                                    inputProps={{
                                        name: 'modality',
                                        id: 'modality',
                                    }}
                            >
                                {optsModality.map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.root}>
                            <InputLabel htmlFor='iqm'>IQM</InputLabel>
                            <Select
                                value={this.state.iqm}
                                onChange={this.handleChange('iqm')}
                                multiple={true}
                                inputProps={{
                                    name: 'iqm',
                                    id: 'iqm',
                                }}
                            >
                                {this.state.modality && optsIqm[this.state.modality].map(opt => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div style={{marginBottom: '10px'}}>
                            <Button variant='outlined' size='small' color='primary' className={classes.margin}
                                    onClick={this.iqmAll}>
                                All IQMs
                            </Button>
                            <Button variant='outlined' size='small' color='primary' className={classes.margin}
                                    onClick={this.iqmNone}>
                                Clear IQMs
                            </Button>
                        </div>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Timing</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor='task'>Task</InputLabel>
                                    <Select
                                        value={this.state.task}
                                        onChange={this.handleChange('task')}
                                        inputProps={{
                                            name: 'task',
                                            id: 'task',
                                        }}
                                    >
                                        <MenuItem value='all'>
                                            <em>All</em>
                                        </MenuItem>
                                        {optsTask.map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor='run'>Run</InputLabel>
                                    <Select
                                        disabled={true} // Data not available
                                        value={this.state.run}
                                        onChange={this.handleChange('run')}
                                        inputProps={{
                                            name: 'run',
                                            id: 'run',
                                        }}
                                    >
                                        <MenuItem value='all'>
                                            <em>All</em>
                                        </MenuItem>
                                        {optsRun.map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor='manualQC'>Manual QC Reviewed</InputLabel>
                                    <Select
                                        value={this.state.manualQC}
                                        onChange={this.handleChange('manualQC')}
                                        inputProps={{
                                            name: 'manualQC',
                                            id: 'manualQC',
                                        }}
                                    >
                                        <MenuItem value='all'>
                                            <em>All</em>
                                        </MenuItem>
                                        {optsManualQC.map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Demographics</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <FormControl className={classes.formControl} disabled={true}>
                                    <InputLabel htmlFor='age'>Age</InputLabel>
                                    <Select
                                        disabled={true} // Data not available
                                        value={this.state.age}
                                        onChange={this.handleChange('age')}
                                        inputProps={{
                                            name: 'age',
                                            id: 'age',
                                        }}
                                    >
                                        <MenuItem value='all'>
                                            <em>All</em>
                                        </MenuItem>
                                        <MenuItem value={10}>0-17</MenuItem>
                                        <MenuItem value={20}>18-54</MenuItem>
                                        <MenuItem value={30}>55+</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor='sex'>Sex</InputLabel>
                                    <Select
                                        value={this.state.sex}
                                        onChange={this.handleChange('sex')}
                                        inputProps={{
                                            name: 'sex',
                                            id: 'sex',
                                        }}
                                    >
                                        <MenuItem value='all'>
                                            <em>All</em>
                                        </MenuItem>
                                        <MenuItem value='M'>Male</MenuItem>
                                        <MenuItem value='F'>Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Device</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor='manufacturer'>MRI Machine Manufacturer</InputLabel>
                                    <Select
                                        value={this.state.manufacturer}
                                        onChange={this.handleChange('manufacturer')}
                                        inputProps={{
                                            name: 'manufacturer',
                                            id: 'manufacturer',
                                        }}
                                    >
                                        <MenuItem value='all'>
                                            <em>All</em>
                                        </MenuItem>
                                        {optsManufacturer.map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor='model'>MRI Machine Model</InputLabel>
                                    <Select
                                        value={this.state.model}
                                        onChange={this.handleChange('model')}
                                        inputProps={{
                                            name: 'model',
                                            id: 'model',
                                        }}
                                    >
                                        <MenuItem value='all'>
                                            <em>All</em>
                                        </MenuItem>
                                        {this.state.manufacturer !== 'all' && optsManufacturerModel[this.state.manufacturer].map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>

                        <Typography className={classes.heading} style={{marginTop: '30px'}}>Split</Typography>
                        <Typography>The matching filter setting will be ignored.</Typography>
                        <FormControl className={classes.root}>
                            <InputLabel htmlFor='splitX'>Split X axis</InputLabel>
                            <Select
                                disabled={true}
                                value={this.state.splitX}
                                onChange={this.handleChange('splitX')}
                                inputProps={{
                                    name: 'splitX',
                                    id: 'splitX',
                                }}
                            >
                                <MenuItem value=''>
                                    <em>No Split</em>
                                </MenuItem>
                                <MenuItem value='sex'>sex</MenuItem>
                                <MenuItem value='age'>age</MenuItem>
                                <MenuItem value='model'>model</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.root}>
                            <InputLabel htmlFor='splitViolin'>Split Violin into 2 parts</InputLabel>
                            <Select
                                disabled={true}
                                value={this.state.splitViolin}
                                onChange={this.handleChange('splitViolin')}
                                inputProps={{
                                    name: 'splitViolin',
                                    id: 'splitViolin',
                                }}
                            >
                                <MenuItem value=''>
                                    <em>No Split</em>
                                </MenuItem>
                                <MenuItem value='sex'>sex</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </Grid>
                <Grid item xs={12} sm={6} md={7} lg={8} xl={9}>
                    {this.state.datas.map(d => ( // Show an appropriate message when datas is empty
                        <Chart data={d.data} label={d.iqm} key={d.iqm}/>
                    ))}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Dashboard);
