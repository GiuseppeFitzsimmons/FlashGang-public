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
import FlashDeckEditor from './flashdeckeditor'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import AdminDecksEditor from './admindeckseditor';



class AdminDecks extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: this.props.open, modalShowing: false, deck: {} }
        this.suspension = false
        var cursor = this.props.cursor
        this.string = ''
    }

    componentDidMount() {
        console.log('admindecks componentdidmount')
        this.props.getAllDecks()
        console.log('suspension filter is set to', this.suspension)
    }
    componentDidUpdate() {
        console.log('suspension filter is set to', this.suspension)
    }
    render() {
        var index = ''
        const openModal = (deck) => {
            console.log('modal was opened for ', deck)
            this.setState({ modalShowing: true, deck: deck })
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
        const generateDeckList = () => {
            if (this.props.decks) {
                console.log('this.props.decks', this.props.decks)
                var deckArray = []
                this.deckArray = this.props.decks.map((deck) =>
                    <div>
                        <FlashButton
                            buttonType='system'
                            onClick={() => {
                                console.log('modalShowing', this.state.modalShowing)
                                openModal(deck)
                            }}
                        >
                            {deck.name}
                        </FlashButton>
                    </div>
                )
            }
        }
        const closeModal = () => {
            this.setState({ modalShowing: false })
        }
        generateDeckList()
        console.log('admindecks', this.props.decks)
        return (
            <>
                <Dialog
                    open={this.state.modalShowing}
                    closeModal={closeModal}
                >
                    <DialogContent>
                        <AdminDecksEditor
                            open={this.state.modalShowing}
                            flashDeck={this.state.deck}
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
                                this.props.getAllDecks({ suspension: this.suspension, cursor: this.cursor })
                            } else {
                                this.props.getAllDecks({ suspension: this.suspension })
                            }
                        }}
                    >
                        Fetch decks
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
                                this.props.getAllDecks({ string: this.string })
                            }
                        }}
                    >
                        Search
                </FlashButton>
                    <Grid>
                        {this.deckArray}
                    </Grid>
                </Grid>
            </>
        )
    }
}

function mapStateToProps(state, props) {
    console.log('mapstatetoprops decks', state.decks)
    return { decks: state.decks, cursor: state.cursor, user: state.user }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDecks)