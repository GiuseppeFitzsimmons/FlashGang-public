import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import {
    Col,
    Input
} from "reactstrap";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, GridList, DialogContent } from '@material-ui/core';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import AdminGangsEditor from './admingangseditor';



class AdminGangs extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: this.props.open, modalShowing: false, gang: {} }
        this.suspension = false
        var cursor = this.props.cursor
        this.string = ''
    }

    componentDidMount() {
        console.log('admingangs componentdidmount')
        this.props.getAllGangs()
        console.log('suspension filter is set to', this.suspension)
    }
    componentDidUpdate() {
        console.log('suspension filter is set to', this.suspension)
    }
    render() {
        var index = ''
        const openModal = (gang) => {
            console.log('modal was opened for ', gang)
            this.setState({ modalShowing: true, gang: gang })
        }
        const setSuspension = (checked) => {
            console.log('suspension set to', checked)
            if (checked) {
                this.suspension = true
            } else {
                this.suspension = false
            }
        }
        const setString = (value) => {
            console.log('string set to', value)
            this.string = value
        }
        const generateGangList = () => {
            if (this.props.gangs) {
                console.log('this.props.gangs', this.props.gangs)
                var gangArray = []
                this.gangArray = this.props.gangs.map((gang) =>
                    <div>
                        <FlashButton
                            buttonType='system'
                            onClick={() => {
                                console.log('modalShowing', this.state.modalShowing)
                                openModal(gang)
                            }}
                        >
                            {gang.name}
                        </FlashButton>
                    </div>
                )
            }
        }
        const closeModal = () => {
            this.setState({ modalShowing: false })
        }
        generateGangList()
        console.log('admingangs', this.props.gangs)
        return (
            <>
                <Dialog
                    open={this.state.modalShowing}
                    closeModal={closeModal}
                >
                    <DialogContent>
                        <AdminGangsEditor
                            open={this.state.modalShowing}
                            flashGang={this.state.gang}
                            closeModal={closeModal}
                        />
                    </DialogContent>
                </Dialog>

                <Grid>
                    Suspended
                <Checkbox
                        //defaultChecked
                        color="default"
                        value="suspended"
                        inputProps={{ 'aria-label': 'checkbox with default color' }}
                        onChange={
                            (event) => {
                                setSuspension(event.target.checked)
                                this.cursor = null
                            }}
                    />
                    <FlashButton
                        buttonType='system'
                        onClick={() => {
                            console.log('filters onClick', this.subscription)
                            if (this.props.cursor && this.props.cursor != null) {
                                this.cursor = this.props.cursor.id
                                console.log('cursor', this.cursor)
                                this.props.getAllGangs({ suspension: this.suspension, cursor: this.cursor })
                            } else {
                                this.props.getAllGangs({ suspension: this.suspension })
                            }
                        }}
                    >
                        Fetch gangs
                </FlashButton>
                    <TextField id="standard-basic" label="Search..."
                        onChange={
                            (event) => {
                                setString(event.target.value)
                            }
                        }
                    />
                    <FlashButton
                        buttonType='system'
                        onClick={() => {
                            if (this.string.length > 0) {
                                this.props.getAllGangs({ string: this.string })
                            }
                        }}
                    >
                        Search
                </FlashButton>
                    <Grid>
                        {this.gangArray}
                    </Grid>
                </Grid>
            </>
        )
    }
}

function mapStateToProps(state, props) {
    console.log('mapstatetoprops gangs', state.gangs)
    return { gangs: state.gangs, cursor: state.cursor, user: state.user }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminGangs)