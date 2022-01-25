import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import RenderToLayer from 'material-ui/internal/RenderToLayer';
import { render } from 'react-dom';
import { Button, Grid, GridList } from '@material-ui/core';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';

class AdminGangsEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalShowing: this.props.modalShowing
        }
    }
    componentDidMount() {
        console.log('this.props.flashGang', this.props.flashGang)
    }
    componentDidUpdate() {
    }

    render() {
        console.log('gangeditor state', this.state)
        return (
            <>
                <div>
                    {this.props.flashGang.name}
                    {this.props.flashGang.owner}
                </div>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        console.log('suspending deck')
                        this.props.flashGang.suspended = true
                        this.props.closeModal()
                        this.props.suspendGang(this.props.flashGang)
                    }}
                >
                    Suspend
                </FlashButton>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        this.props.closeModal()

                    }}
                >
                    Cancel
                </FlashButton>
            </>
        )

    }
}

function mapStateToProps(state, props) {
    console.log('mapstatetoprops gangs', state.gangs)
    return { gangs: state.gangs, cursor: state.cursor, modalShowing: state.modalShowing }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminGangsEditor)