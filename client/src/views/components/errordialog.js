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

class ErrorDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false }
        this.handleClose = this.handleClose.bind(this);
    }
    handleClose() {
        this.setState({ open: false })
    }
    render() {
        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                fullWidth={true}
                maxWidth='lg'
                onEntering={this.handleEntering}
                aria-labelledby="confirmation-dialog-title"
                open={this.props.error}
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
                                    {this.props.error}
                                </Grid>
                            </Grid>
                        </Grid>
                </DialogContent>

                <DialogActions>
                    <FlashButton onClick={()=>{
                        this.handleClose()
                        this.props.onClose()
                    }} color="primary" buttonType='action'>
                        Ok
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

export default connect(mapStateToProps, mapDispatchToProps)(ErrorDialog)