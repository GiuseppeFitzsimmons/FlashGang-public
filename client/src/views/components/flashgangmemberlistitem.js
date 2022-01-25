import React from 'react';
import { Button, Grid, GridList, Container } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import IntegratedInput from '../widgets/IntegratedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withTheme } from '@material-ui/styles';
//https://react-icons.netlify.com/#/icons/md
import { MdDelete, MdModeEdit } from 'react-icons/md';
//https://react-icons.netlify.com/#/icons/gi
import { GiSwordman, GiHoodedFigure, GiBrutalHelm, GiImperialCrown, GiFedora, GiCaptainHatProfile, GiFloorHatch } from 'react-icons/gi';
import Paper from 'material-ui/Paper';
import Popover from '@material-ui/core/Popover';
import { FlashTypography, FlashButton } from '../widgets/FlashBits';
import ClickNHold from 'react-click-n-hold';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

const someImage = require('../../utility/smimages');

const styles = theme => ({
    paper: {
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
const randomProfiles = [
    'https://upload.wikimedia.org/wikipedia/commons/f/f1/Sophia_Loren_1962.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/1b/LuckyLucianoSmaller.jpeg',
    'https://i.ebayimg.com/images/g/NIAAAOSwAaJaQuGk/s-l300.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Carlo_Gambino.jpg/1280px-Carlo_Gambino.jpg',
    'https://www.onthisday.com/images/people/bugsy-siegel-medium.jpg',
    'https://themobmuseum.org/wp-content/uploads/2016/03/3-21-16-Virginia-Hill.jpg',

]

class FlashGangMemberListItemStyled extends React.Component {
    constructor(props) {
        super(props)
        this.state = { editing: !props.gangMember.id || props.gangMember.id == '' }
    }
    render() {
        var editLevel = 2;
        if (this.props.flashGang) {
            if (this.props.flashGang.rank == 'LIEUTENANT') {
                editLevel = 1;
            } else if (this.props.flashGang.rank == 'BOSS') {
                editLevel = 0;
            } else if (this.props.user.id == this.props.flashGang.owner) {
                editLevel = 0;
            }
        }
        this.props.gangMember.picture = this.props.gangMember.picture ? this.props.gangMember.picture : someImage.getRandomGangsterImage()
        var name = this.props.gangMember.firstName;
        if (name) {
            if (this.props.gangMember.lastName) {
                name += ' ' + this.props.gangMember.lastName;
            }
        } else {
            name = this.props.gangMember.lastName;
        }
        if (!name) {
            name = this.props.gangMember.id;
        }
        if (!name || name == '') {
            name = 'New member'
        }
        var big = this.props.small ? 'h7' : 'h5';
        var medium = this.props.small ? 'h9' : 'h5';
        var small = this.props.small ? 'h10' : 'h6';
        var mininmumHeight = this.props.small ? '12%' : '12%';
        if (this.props.flashGang.suspended) {
            return (
                <>
                </>
            )
        } else {
            return (
                <Grid container spacing={0} direction='row' style={{
                    marginTop: '4px',
                    minHeight: mininmumHeight,
                    cursor: 'pointer'
                }}
                    onClick={this.props.onClick}
                    id={this.props.id}>
                    <Grid item xs={2} sm={2} md={1} style={this.props.theme.actionListItem}>
                        <Container style={{
                            height: '100%',
                            backgroundImage: `url('${this.props.gangMember.picture}')`,
                            backgroundSize: '100%',
                            backgroundRepeat: 'no-repeat',
                            marginRight: '4px'
                        }}
                            height={'20%'}>
                        </Container>
                    </Grid>
                    <Grid container direction='column' xs={10} sm={10} md={11}
                        style={this.props.theme.actionListItem}>
                        <Container style={{
                            paddingLeft: '4px',
                            height: '100%',
                            paddingTop: this.props.gangMember.rank ? 0 : '6px'
                        }}
                            height={'20%'}
                            onClick={() => {
                                this.setState({ editing: true })
                            }}>
                            <FlashTypography variant={this.props.gangMember.rank ? medium : big} label>
                                {name}
                            </FlashTypography>
                            <FlashTypography variant='h7' sublabel>
                                {this.props.gangMember.rank}
                            </FlashTypography>
                        </Container>
                    </Grid>
                    <Dialog /*onClose={handleClose}*/ aria-labelledby="simple-dialog-title"
                        open={this.state.editing}
                        maxWidth='lg' fullWidth>
                        <Grid container spacing={0} direction='column' style={{ width: '100%', padding: '4px' }}>
                            <Grid item xs={12} sm={12} md={12} >
                                <IntegratedInput
                                    label='Gang member email'
                                    placeholder='@'
                                    onChange={
                                        (event) => {
                                            this.props.gangMember.id = event.target.value;
                                            this.forceUpdate();
                                        }
                                    }
                                    ref={
                                        input => input ? input.reset(this.props.gangMember.id) : true
                                    }
                                />
                            </Grid>
                            <Grid xs={12} sm={12} md={12} >
                                <div style={{ marginTop: '10px' }}>
                                    <label style={{ color: '0,0,0,0.6' }}>Rank</label><br />
                                    <Select
                                        value={this.props.gangMember.rank}
                                        onChange={
                                            (event) => {
                                                this.props.gangMember.rank = event.target.value;
                                                this.forceUpdate()
                                            }
                                        }
                                        style={{ width: '100%' }}
                                    >
                                        {editLevel < 1 &&
                                            <MenuItem value={'BOSS'}>BOSS</MenuItem>
                                        }
                                        {editLevel < 2 &&
                                            <MenuItem value={'LIEUTENANT'}>LIEUTENANT</MenuItem>
                                        }
                                        <MenuItem value={'MEMBER'}>MEMBER</MenuItem>
                                    </Select>
                                </div>
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <FlashButton onClick={() => this.setState({ editing: false })} buttonType='action'
                                disabled={!this.props.gangMember.id || this.props.gangMember.id == ''}>
                                Close
                            </FlashButton>
                            <FlashButton onClick={() => {
                                if (this.props.onDelete) {
                                    this.props.onDelete();
                                }
                                this.setState({ editing: false })
                            }}
                                buttonType='action'>
                                Delete
                            </FlashButton>
                        </DialogActions>
                    </Dialog>
                </Grid>
            )
        }

    }
}
class FlashDeckListItemStyled extends React.Component {

    render() {
        var big = this.props.small ? 'h7' : 'h5';
        var medium = this.props.small ? 'h9' : 'h5';
        var small = this.props.small ? 'h10' : 'h6';
        var mininmumHeight = this.props.small ? '12%' : '8%';
        if (!this.props.flashDeck.image) {
            this.props.flashDeck.image = someImage.getRandomSubjectImage();
        }
        if (this.props.flashDeck.suspended) {
            return (
                <>
                </>
            )
        } else {
            return (

                <Grid container spacing={0} style={{
                    marginTop: '4px',
                    minHeight: mininmumHeight,
                    cursor: 'pointer'
                }}
                    onClick={this.props.onClick}>
                    <Grid item xs={2} sm={2} md={1} style={this.props.theme.actionListItem}>
                        <Container style={{
                            height: '100%',
                            backgroundImage: `url('${this.props.flashDeck.image}')`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            marginRight: '4px'
                        }}
                            height={'10%'}>
                        </Container>
                    </Grid>
                    <Grid container direction='column' xs={10} sm={10} md={11}
                        style={{ ...this.props.theme.actionListItem, ...{ backgroundColor: this.props.selected ? this.props.theme.palette.primary.selected : this.props.theme.palette.secondary.selected } }}>
                        <Container style={{
                            paddingLeft: '4px',
                            paddingTop: this.props.flashDeck.description ? 0 : '6px'
                        }}>
                            <FlashTypography variant={this.props.flashDeck.description ? medium : big} label>
                                {this.props.flashDeck.name}
                            </FlashTypography>
                            {this.props.flashDeck.description &&
                                <FlashTypography variant={small} sublabel>
                                    {this.props.flashDeck.description}
                                </FlashTypography>
                            }
                        </Container>
                    </Grid>
                </Grid>
            )
        }

    }
}

class FlashDeckListButtonStyled extends React.Component {

    render() {
        var big = this.props.small ? 'h7' : 'h4';
        var medium = this.props.small ? 'h9' : 'h5';
        var small = this.props.small ? 'h10' : 'h6';
        return (

            <Grid container spacing={0} style={{ paddingTop: '4px', minHeight: '8%', width: '100%' }}

                onClick={this.props.onClick}>
                <Grid item xs={12} sm={12} md={12} style={this.props.theme.actionListItem}>
                    <Container style={{
                        padding: '4px'
                    }}>
                        <FlashTypography variant={this.props.sub ? medium : big} label>
                            {this.props.main}
                        </FlashTypography>
                        <FlashTypography variant={small} sublabel>
                            {this.props.sub}
                        </FlashTypography>
                    </Container>
                </Grid>
            </Grid>
        )
    }
}
const FlashGangMemberListItem = withTheme(FlashGangMemberListItemStyled);
const FlashDeckListItem = withTheme(FlashDeckListItemStyled);
const FlashDeckListButton = withTheme(FlashDeckListButtonStyled);
export {
    FlashGangMemberListItem,
    FlashDeckListItem,
    FlashDeckListButton
}