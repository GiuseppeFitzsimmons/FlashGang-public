import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { FlashListItem } from './FlashBits';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Icon from '@material-ui/core/Icon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import { Button, Grid, GridList } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const someImages = require('../../utility/smimages')

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class FlashAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { openDrawer: false, helpOpen: false, helpText:'' }
    this.openHelp=this.openHelp.bind(this);
    this.closeHelp=this.closeHelp.bind(this);
  }
  toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({ ...this.state, openDrawer: open });
  };
  listItem = (action, image, primary, secondary) => {
    return (
      <Grid container
        onClick={action}
        direction='row'
        justify="space-evenly"
      >
        <Grid item md={2} sm={2} xs={2}
        justify="center"
        >
          <Avatar
            src={image}
            style={{ borderRadius: '50%', width:'42px' }} />
        </Grid>
        <Grid item md={1} sm={1} xs={1}/>
        <Grid item md={9} sm={9} xs={9}
        justify="center"
        >
          <ListItemText
            primary={primary}
            secondary={secondary}
          />
        </Grid>
      </Grid>
    )
  }
  openHelp=(text)=>{
    this.setState({ ...this.state, helpOpen:true, helpText: text})
  }
  closeHelp=()=>{
    this.setState({ ...this.state, helpOpen:false})
  }
  render() {
    let renderable = <>
      {this.props.goSettings &&
        this.listItem(this.props.goSettings,
          this.props.user && this.props.user.picture ? this.props.user.picture : someImages.getRandomGangsterImage(),
          "Settings",
          "Express yourself"
        )
      }
      {this.props.onLogOut &&
        this.listItem(this.props.onLogOut,
          '/exit.jpg',
          "Log out",
          "Come back soon"
        )
      }
      {this.props.goHome &&
        this.listItem(this.props.goHome,
          someImages.getRandomSubjectImage(),
          "Home",
          "Go to your fashdecks"
        )
      }
      {this.props.goGangs &&
        this.listItem(this.props.goGangs,
          someImages.getRandomGangImage(),
          "Flash gangs",
          "Manage your gangs"
        )
      }
    </>
    let helpButton=<>
      {this.props.help && this.props.help!='' &&
      <HelpIcon onClick={()=>this.openHelp(this.props.help)}/>
    }
    </>
    return (
      <div style={{
        marginBottom: '60px'
      }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => { this.setState({ openDrawer: true }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              {this.props.title ? this.props.title : 'FlashGang'}
            </Typography>
            <div style={{marginLeft:'auto'}}>
            <IconButton aria-label="show 17 new notifications" color="inherit">
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
            {helpButton}
            </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.openDrawer} onClose={this.toggleDrawer(false)}>
          <div style={{margin:'8px'}}>
            {renderable}
            </div>
        </Drawer>
      <Dialog
        open={this.state.helpOpen}
        onClose={this.closeHelp}
        maxWidth='lg'
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        onClick={this.closeHelp}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          {this.state.helpText}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      </div>
    );
  }
}