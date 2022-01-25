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

class Upgrade extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false }
        this.handleClose = this.handleClose.bind(this);
        this.poll = {
            poll: 'upgrade'
        }
    }
    open(station) {
        this.poll.station=station;
        this.setState({ open: true })
    }
    handleClose() {
        this.setState({ open: false })
    }
    componentDidMount(){
        this.props.parent.upgrade = this
    }
    render() {
        let stationMessage='To perform this action, you need to upgrade your membership';
        if (this.poll.station==='DECK') {
            stationMessage='To add more cards, you need to upgrade your membership';
        } else if (this.poll.station==='DECKS') {
            stationMessage='To add another deck, you need to upgrade your membership';
        } else if (this.poll.station==='GANG') {
            stationMessage='To invite another member to your gang, you need to upgrade your membership';
        } else if (this.poll.station==='GANGS') {
            stationMessage='To create another gang, you need to upgrade your membership';
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
                <DialogTitle id="confirmation-dialog-title">Upgrade</DialogTitle>

                <DialogContent dividers>
                    <RadioGroup>
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
                                    <b>
                                    {stationMessage}<br />
                                    Upgrades are not yet available during the beta period, but you can express your interest now for a discount when the functionality is delivered in the near future.<br />
                                    Please select a subscription that appeals to you.
                                    </b>
                                    <br /><br />
                                    <Divider />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                            >
                                <Grid
                                    item xs={2} sm={2} md={1}
                                >
                                    <Radio
                                        onChange={(event) => { this.poll.pollAnswer = 'ASSOCIATE' }}
                                        name='FormControlLabelButton'
                                        value={'A'}

                                    />
                                </Grid>
                                <Grid
                                    item xs={10} sm={10} md={11}
                                >
                                    Associate $1.99/year <br />
                                    Up to 25 FlashDecks with 100 Cards per deck <br />
                                    Up to 10 FlashGangs <br />
                                    Up to 10 members per gang <br />
                                    <br />
                                    <Divider />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                            >
                                <Grid
                                    item xs={2} sm={2} md={1}
                                >
                                    <Radio
                                        onChange={(event) => { this.poll.pollAnswer = 'SOTTO_CAPO' }}
                                        name='FormControlLabelButton'
                                        value={'B'}

                                    />
                                </Grid>
                                <Grid
                                    item xs={10} sm={10} md={11}
                                >
                                    Sotto-capo $2.99/year<br />
                                    Up to 50 FlashDecks with 200 Cards per deck<br />
                                    Up to 20 FlashGangs<br />
                                    Up to 20 members per gang<br />
                                    <br />
                                    <Divider />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                            >
                                <Grid
                                    item xs={2} sm={2} md={1}
                                >
                                    <Radio
                                        onChange={(event) => { this.poll.pollAnswer = 'CAPO' }}
                                        name='FormControlLabelButton'
                                        value={'C'}

                                    />
                                </Grid>
                                <Grid
                                    item xs={10} sm={10} md={11}
                                >
                                    Capo $5.99/year<br />
                                    Up to 100 FlashDecks with 300 Cards per deck<br />
                                    Up to 100 FlashGangs<br />
                                    Up to 1000 members per gang<br />
                                    Manage public gangs<br />
                                    <br />
                                    <Divider />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                            >
                                <Grid
                                    item xs={2} sm={2} md={1}
                                >
                                    <Radio
                                        onChange={(event) => { this.poll.pollAnswer = 'CHEAPER' }}
                                        name='FormControlLabelButton'
                                        value={'D'}

                                    />
                                </Grid>
                                <Grid
                                    item xs={10} sm={10} md={11}
                                >
                                    I’d prefer a cheaper option<br />
                                    <br />
                                    <Divider />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                            >
                                <Grid
                                    item xs={2} sm={2} md={1}
                                >
                                    <Radio
                                        onChange={(event) => { this.poll.pollAnswer = 'COMPLETE' }}
                                        name='FormControlLabelButton'
                                        value={'E'}

                                    />
                                </Grid>
                                <Grid
                                    item xs={10} sm={10} md={11}
                                >
                                    I’d prefer a more complete option
                            </Grid>
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </DialogContent>

                <DialogActions>
                    <FlashButton onClick={()=>{
                        this.handleClose()
                        this.props.poll(this.poll)
                    }} color="primary" buttonType='system'>
                        Save
                    </FlashButton>
                    <FlashButton onClick={this.handleClose} color="primary" buttonType='system'>
                        Cancel
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

export default connect(mapStateToProps, mapDispatchToProps)(Upgrade)