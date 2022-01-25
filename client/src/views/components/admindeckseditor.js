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

class AdminDecksEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalShowing: this.props.modalShowing
        }
    }
    componentDidMount() {
        console.log('this.props.flashDeck', this.props.flashDeck)
    }
    componentDidUpdate() {
    }

    render() {
        console.log('deckeditor state', this.state)
        return (
            <>
                <div>
                    {this.props.flashDeck.name}
                    {this.props.flashDeck.owner}
                </div>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        console.log('suspending deck')
                        this.props.flashDeck.suspended = true
                        this.props.closeModal()
                        this.props.suspendDeck(this.props.flashDeck)
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
    console.log('mapstatetoprops users', state.users)
    return { users: state.users, cursor: state.cursor, modalShowing: state.modalShowing }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDecksEditor)