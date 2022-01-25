import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FlashAppBar from '../widgets/flashappbar'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Icon from '@material-ui/core/Icon';
import { MdDelete } from 'react-icons/md';
import DeckSelector from '../widgets/deckselector';
import { IconSelector } from '../widgets/iconselector';
import { FlashGangMemberListItem, FlashDeckListItem, FlashDeckListButton } from './flashgangmemberlistitem';
import Upgrade from '../components/upgrade';
import Confirmation from '../components/confirmation';
import { withTheme } from '@material-ui/styles';
import { Gallery } from '../components/gallery';

const someImages = require('../../utility/smimages');


const someIcons = ['language', 'timeline', 'toc', 'palette', 'all_inclusive', 'public', 'poll', 'share', 'emoji_symbols']

class FlashGangEditorStyled extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            memberTab: 'block',
            deckTab: 'none',
            editingIndex: -1,
            popupId: ''
        }
        this.invite = this.invite.bind(this)
        this.onDecksSelected = this.onDecksSelected.bind(this)
    }
    componentDidMount() {
        if (!this.props.flashGangId) {
            this.props.newGang()
        } else {
            this.props.loadFlashGang(this.props.flashGangId)
        }
        if (this.props.navEvent) {
            this.props.navEvent.backButton = this.props.goGangs;
        }
    }
    componentDidUpdate() {
    }
    onDecksSelected() {
        this.forceUpdate()
    }
    invite() {
        if (!this.props.flashGang.members) {
            this.props.flashGang.members = []
        }
        this.props.flashGang.remainingMembersAllowed--
        this.props.flashGang.members.push({
            id: '',
            rank: 'MEMBER',
            state: "TO_INVITE"
        })
        this.forceUpdate()
    }
    removeMember(index) {
        this.props.flashGang.remainingMembersAllowed++
        this.props.flashGang.members.splice(index, 1)
        this.forceUpdate()
    }

    render() {
        //const classes = useStyles();
        const flashGang = this.props.flashGang ? this.props.flashGang : {}

        if (!flashGang.image) {
            //flashGang.image =  `/gangs-${Math.floor(Math.random() * Math.floor(20))}.jpg`
            flashGang.image = someImages.getRandomGangImage();
        }
        const isOwner = this.props.user && this.props.user.id == flashGang.owner
        return (
            <>
                <FlashAppBar title='FlashGang!' station='GANGS'
                    goHome={this.props.goHome}
                    onLogOut={this.props.onLogOut}
                    goSettings={this.props.goSettings}
                    user={this.props.user}
                    help={<>This is your FlashGang editor.<br/> 
                        To invite new members, click on the New Member button in the members tab, and enter an email address.
                        In this tab you can also assign permissions by rank to your gang members<br/>
                        On the Gang Decks tab, you can add your decks to this gang, so that your gang members can test themselves
                        and, if they have a rank of Lieutenant, they can edit the decks in this gang.</>}
                      />

                <Grid container
                    direction="column"
                    justify="flex-start"
                    alignItems="stretch"
                    style={{
                        height: '100%',
                        paddingTop: '8px'
                    }}
                >

                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                        style={{
                            height: '7%',
                            marginBottom: '8px'
                        }}>
                        <Grid item md={1} sm={1} xs={2}>
                            <Gallery
                                onImageSelected={image => flashGang.image = image}
                                image={flashGang.image}
                                imageButton
                                station='GANG'
                                closeOnSelect
                            />
                        </Grid>
                        <Grid item md={11} sm={11} xs={10} style={{ paddingLeft: '2px' }}>
                            <IntegratedInput
                                label="Gang Name"
                                id='gangName'
                                placeholder='Your gang name'
                                onChange={
                                    (event) => { flashGang.name = event.target.value }
                                }
                                ref={
                                    input => input ? input.reset(flashGang.name) : true
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid item
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                        style={{
                            height: '10%'
                        }}>
                        <IntegratedInput
                            label="Gang Description"
                            id='gangDescription'
                            placeholder='Your gang description'
                            onChange={
                                (event) => { flashGang.description = event.target.value }
                            }
                            ref={
                                input => input ? input.reset(flashGang.description) : true
                            }
                        />
                    </Grid>
                    <Tabs
                        style={{
                            height: '5%'
                        }}
                        onChange={(e, value) => {
                            this.setState({
                                memberTab: value == 0 ? 'block' : 'none',
                                deckTab: value == 1 ? 'block' : 'none'
                            })
                        }}>
                        <Tab label="Gang members" style={{ backgroundColor: this.state.memberTab == 'block' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.0)' }} />
                        <Tab label="Gang decks" style={{ backgroundColor: this.state.deckTab == 'block' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.0)' }} />
                    </Tabs>

                    <Box
                        style={{
                            display: this.state.memberTab,
                            backgroundColor: 'rgba(255,255,255,0.4)',
                            padding: '2px',
                            height: '55%',
                            overflow: 'auto',
                            overflowX: 'hidden'
                        }}
                    >
                        <FlashDeckListButton
                            onClick={
                                () => {
                                    if (this.props.flashGang.remainingMembersAllowed > 0) {
                                        this.invite()
                                    } else {
                                        this.upgrade.open('GANG')
                                    }
                                }}
                            main='New Member'
                            sub='Click here to invite a gang member' />
                        {this.generateFlashGangMemberList()}
                    </Box>
                    <Box
                        style={{
                            display: this.state.deckTab,
                            backgroundColor: 'rgba(255,255,255,0.4)',
                            padding: '2px',
                            height: '55%',
                            overflow: 'auto',
                            overflowX: 'hidden'
                        }}
                    >
                        <DeckSelector
                            onClose={this.onDecksSelected}
                            flashGang={flashGang}
                        />
                        {this.generateFlashDeckList()}
                    </Box>
                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="stretch"
                        style={{
                            height: '6%'
                        }}
                    >
                        <FlashButton
                            buttonType='system'
                            style={{ width: isOwner ? '48%' : '100%' }}
                            onClick={() => { this.props.saveGang(flashGang) }} >
                            Save
                        </FlashButton>
                        <FlashButton
                            buttonType='system'
                            style={{ width: '48%', display: isOwner ? '' : 'none' }}
                            onClick={() => { this.confirmation.open('GANGS') }} >
                            Delete
                        </FlashButton>
                        <Upgrade
                            parent={this}
                        >
                        </Upgrade>
                        <Confirmation
                            parent={this}
                            onConfirm={() => {
                                this.props.deleteGang(flashGang.id)
                                this.props.goGangs()
                            }}
                        />
                    </Grid>
                </Grid>
            </>
        )
    }
    generateFlashGangMemberList = () => {
        const flashGang = this.props.flashGang ? this.props.flashGang : {}
        if (!flashGang.members) {
            return (
                <></>
            )
        }
        var _display = flashGang.members.map((member, i) => {
            return (
                <>
                    <FlashGangMemberListItem
                        gangMember={member}
                        flashGang={flashGang}
                        user={this.props.user}
                        onDelete={() => { this.removeMember(i) }}
                        onMemberEdited={() => this.forceUpdate()}
                        //onClick={() => {}}
                        id={'flashgang-index-' + i}
                    />
                </>
            )
        })
        return (
            <>
                {_display}
            </>
        )
    }
    generateFlashDeckList() {
        const flashDecks = this.props.flashGang && this.props.flashGang.flashDecks ? this.props.flashGang.flashDecks : []
        var _display = flashDecks.map((flashDeck, i) => {
            if (!flashDeck.icon) {
                flashDeck.icon = someIcons[Math.floor(Math.random() * Math.floor(someIcons.length))]
            }
            return (
                <FlashDeckListItem flashDeck={flashDeck}
                    onClick={() =>
                        this.props.onFlashDeckSelected(flashDeck.id, 'TEST', 'GANGS')
                    } />
            )
        })
        return (
            <>
                {_display}
            </>
        )
    }
}





function mapStateToProps(state, props) {
    return {
        flashGang: state.flashGang,
        user: state.user
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

const FlashGangEditor = withTheme(FlashGangEditorStyled);
export default connect(mapStateToProps, mapDispatchToProps)(FlashGangEditor)