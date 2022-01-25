import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { FlashButton } from '../widgets/FlashBits'
import { Grid } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'

class Confirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false }
        this.handleClose = this.handleClose.bind(this);
        this.station = ''
    }
    open(station) {
        this.station=station;
        this.setState({ open: true })
    }
    handleClose() {
        this.setState({ open: false })
    }
    componentDidMount(){
        this.props.parent.confirmation = this
    }
    render() {
        let stationMessage='Are you sure?';
        if (this.station==='DECKS') {
            stationMessage='Are you sure you wish to delete this deck?';
        } else if (this.station==='GANGS') {
            stationMessage='Are you sure you wish to delete this gang?';
        } else if (this.station==='SETTINGS_DELETE') {
            stationMessage='Are you sure you wish to delete your account? This cannot be undone. Are you sure you want to proceeed?';
        } else if (this.station==='DOWNLOAD_DATA') {
            stationMessage='This will initiate an email with a zip attachment containing your FlashGang data in standard (JSON) format. Would you like to proceed?';
        }
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                fullWidth={true}
                maxWidth='lg'
                onEntering={this.handleEntering}
                aria-labelledby="confirmation-dialog-title"
                open={this.state.open}
            >
                <DialogTitle id="confirmation-dialog-title">Confirm</DialogTitle>

                <DialogContent dividers>
                        <Grid container
                            direction="column"
                            justify="space-between"
                            alignItems="flex-start">
                            <Grid
                                container
                                direction="row"
                            >
                                <Grid
                                    item xs={10} sm={10} md={10}
                                >
                                    {stationMessage}
                                </Grid>
                            </Grid>
                        </Grid>
                </DialogContent>

                <DialogActions>
                    <FlashButton onClick={()=>{
                        this.handleClose()
                        this.props.onConfirm()
                    }} color="primary" buttonType='system'>
                        Yes
                    </FlashButton>
                    <FlashButton onClick={this.handleClose} color="primary" buttonType='system'>
                        No
                    </FlashButton>
                </DialogActions>
            </Dialog>
        )
    }
}

function mapStateToProps(state, props) {
    return {}
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation)