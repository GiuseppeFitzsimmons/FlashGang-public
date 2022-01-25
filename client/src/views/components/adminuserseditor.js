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

class AdminUsersEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalShowing: this.props.modalShowing, editableUser: this.props.user,
            newFirstName: '', newLastName: '', imageChanged: false
        }
    }
    componentDidMount() {
        this.setState({ newFirstName: '', newLastName: '' })
        //console.log('picture', this.props.user)
    }
    componentDidUpdate() {
        //this.setState({newFirstName: '', newLastName: '' })
        console.log('picture', this.props.user)
    }

    render() {
        console.log('userseditor state', this.state)
        return (
            <Dialog
                open={this.props.modalShowing}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            //user={this.state.user}
            //var editableUser = {this.state.user}
            >
                <DialogContent>
                    <div>
                        <FlashButton
                            buttonType='system'
                            onClick={() => {
                                console.log('suspending user')
                                this.props.closeModal()
                                this.props.suspendUser(this.props.user)
                            }}
                        >
                            Suspend
                        </FlashButton>
                        <TextField
                            placeholder={this.props.user.firstName}
                            onChange={(event) => {
                                this.state.newFirstName = event.target.value
                                console.log('newFirstName ', this.state.newFirstName)
                            }}
                        >
                        </TextField>
                        <TextField
                            placeholder={this.props.user.lastName}
                            onChange={(event) => {
                                this.state.newLastName = event.target.value
                                console.log('newLastName ', this.state.newLastName)
                            }}
                        >
                        </TextField>
                        <Button
                            onClick={() => {
                                this.setState({ imageChanged: true })
                                console.log('this.state.imageChanged', this.state.imageChanged)
                            }}
                        >
                            <img
                                src={this.props.user.picture}
                                height='100'
                                width='100'
                                alt='Missing image'
                            />
                        </Button>

                    </div>
                </DialogContent>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        if (this.state.newFirstName.length > 0) {
                            this.props.user.firstName = this.state.newFirstName
                        }
                        if (this.state.newLastName.length > 0) {
                            this.props.user.newLastName = this.state.newLastName
                        }
                        if (this.state.imageChanged == true) {
                            this.props.user.picture = '/random_profile_male_1.png'
                        }
                        //this.setState({ modalShowing: false })
                        this.props.closeModal()
                        this.props.saveUser(this.props.user)
                        this.setState({ imageChanged: false })
                    }}
                >
                    Save
                </FlashButton>
                <FlashButton
                    buttonType='system'
                    onClick={() => {
                        this.state.newFirstName = ''
                        this.state.newLastName = ''
                        this.state.imageChanged = false
                        //this.setState({ modalShowing: false })
                        this.props.closeModal()

                    }}
                >
                    Cancel
                </FlashButton>
            </Dialog>
        )

    }
}

function mapStateToProps(state, props) {
    console.log('mapstatetoprops users', state.users)
    return { users: state.users, cursor: state.cursor }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsersEditor)