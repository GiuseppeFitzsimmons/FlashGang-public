import React from 'react';
//import logo from '../logo.svg';
import '../App.css';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../action'
import { Button, Grid, GridList, Container } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { FlashButton, FlashListItem, FlashTypography } from './widgets/FlashBits'
import FlashAppBar from './widgets/flashappbar'
import { FlashDeckListItem, FlashDeckListButton } from './components/flashgangmemberlistitem';
import Box from '@material-ui/core/Box';
import Upgrade from './components/upgrade';


const someIcons = ['language', 'timeline', 'toc', 'palette', 'all_inclusive', 'public', 'poll', 'share', 'emoji_symbols']

class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.props.loadDecks()
  }
  render() {
    const home = this
    const flashDecks = this.props.flashDecks;
    const generateFlashDeckList = () => {
      if (!flashDecks) {
        return (
          <></>
        )
      }
      var _display = flashDecks.map((flashDeck, i) => {
        if (!flashDeck.icon) {
          flashDeck.icon = someIcons[Math.floor(Math.random() * Math.floor(someIcons.length))]
        }
        return (
          <FlashDeckListItem flashDeck={flashDeck}
            onClick={() =>
              this.props.onFlashDeckSelected(flashDeck.id, 'TEST', 'DECKS')
            } />
        )
      })
      return (
        <>
          {_display}
        </>
      )
    }
    return (
      <>
        <FlashAppBar title='FlashGang!' 
          station='HOME' 
          goGangs={this.props.goGangs} 
          onLogOut={this.props.onLogOut} 
          goSettings={this.props.goSettings}
          user={this.props.user}
          help={<>This is your list of FlashDecks. 
            You can create a new deck or select an existing one and test yourself or edit it.<br/>
            If you want to create or edit a gang, click on the menu in the upper left hand corner and choose FlashGangs.</>}
          />
        
          <FlashDeckListButton
            onClick={() => {
              if (this.props.user.remainingFlashDecksAllowed > 0) {
                this.props.onNewButton()
              } else {
                this.upgrade.open('DECKS')
              }
            }}
            main='New FlashDeck'
            sub='Click to create a FlashDeck'/>
          {generateFlashDeckList()}
        <Upgrade
          parent={this}
        >
        </Upgrade>
      </>
    )
  }
}
function mapStateToProps(state, props) {
  console.log('state.user home.js', state.user)
  return { flashDecks: state.flashDecks, user: state.user }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)