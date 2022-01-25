import React from 'react';
import '../App.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../action'
import { FlashButton } from './widgets/FlashBits'
import FlashAppBar from './widgets/flashappbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Upgrade from './components/upgrade';
import { FlashDeckListItem, FlashDeckListButton } from './components/flashgangmemberlistitem';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class FlashGangs extends React.Component {
  constructor(props) {
    super(props)
    this.state = { RSVPDialogOpen: false, flashGang: {} }
  }
  componentDidMount() {
    this.props.loadGangs()
    if (this.props.navEvent) {
      this.props.navEvent.backButton=this.props.goHome;
    }
  }
  openModal(flashGang) {
    this.setState({ RSVPDialogOpen: true, flashGang: flashGang })
  }
  RSVPAnswer(acceptance) {
    if (acceptance) {
      this.state.flashGang.state = 'ACCEPTED'
    } else {
      var i = 0
      for (i in this.props.flashGangs) {
        let gang = this.props.flashGangs[i]
        if (gang.id == this.state.flashGang.id) {
          break
        }
      }
      this.props.flashGangs.splice(i, 1)
    }
    this.props.sendRSVP(this.state.flashGang.id, acceptance)
    this.setState({ RSVPDialogOpen: false })
    if (acceptance) {
      this.props.onFlashGangSelected(this.state.flashGang.id)
    }
  }
  
  render() {
    const flashGangs = this.props.flashGangs;
    const generateFlashGangList = () => {
      if (!flashGangs) {
        return (
          <></>
        )
      }
      var _display = flashGangs.map((flashGang, i) => {
        if (!flashGang.image) {
          flashGang.image =  `/gangs-${Math.floor(Math.random() * Math.floor(20))}.jpg`
          
        }
        return (
          <>
            {this.renderRSVPdialog()}
            
          <FlashDeckListItem flashDeck={flashGang}
            onClick={() => {
              if (flashGang.state == 'TO_INVITE' || flashGang.state == 'INVITED') {
                this.openModal(flashGang)
              } else {
                this.props.onFlashGangSelected(flashGang.id)
              }
            }} />
          </>
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
          station='GANGS' 
          goHome={this.props.goHome} 
          onLogOut={this.props.onLogOut} 
          goSettings={this.props.goSettings}
          user={this.props.user}
          help={<>This is your list of FlashGangs.<br/> 
            You can create a new gang and invite members by adding their email addresses, and you can add FlashDecks that you created in the FlashDeck screen.</>} />
         <FlashDeckListButton
            onClick={() => {
              if (this.props.user.remainingFlashGangsAllowed > 0) {
                this.props.createFlashGang()
              } else {
                this.upgrade.open('GANGS')
              }
            }}
            main='New FlashGang'
            sub='Click to create a FlashGang'/>
          {generateFlashGangList()}
        <Upgrade
          parent={this}
        >
        </Upgrade>
      </>
    )
  }
  
  renderRSVPdialog() {
    var message = <>You have been invited to join <b>{this.state.flashGang.name}</b> <i>({this.state.flashGang.description})</i>. Would you like to accept?</>;
    if (this.state.flashGang.invitedBy) {
      var invitor = this.state.flashGang.invitedBy.id;
      if (this.state.flashGang.invitedBy.firstName || this.state.flashGang.invitedBy.lastName) {
        invitor = (this.state.flashGang.invitedBy.firstName ? this.state.flashGang.invitedBy.firstName + ' ' : '') +
          (this.state.flashGang.invitedBy.lastName ? this.state.flashGang.invitedBy.lastName : '')
      }
      message = <>You have been invited to join <b>{this.state.flashGang.name}</b> by {invitor}. Would you like to accept?</>;
    }
    return (
      <Dialog
        open={this.state.RSVPDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{this.state.flashGang.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FlashButton onClick={() => { this.RSVPAnswer(false) }} color="primary" buttonType='system'>
            Disagree
          </FlashButton>
          <FlashButton onClick={() => { this.RSVPAnswer(true) }} color="primary" buttonType='system'>
            Agree
          </FlashButton>
        </DialogActions>
      </Dialog>
    )
  }
}
function mapStateToProps(state, props) {
  return { flashGangs: state.flashGangs, user: state.user }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashGangs)