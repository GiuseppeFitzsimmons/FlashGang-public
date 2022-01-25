import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './views/home';
import FlashDeck from './views/flashdeck';
import FlashGangs from './views/flashgangs';
import FlashGangEditor from './views/components/flashgangeditor';
import Login from './views/components/login';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import { greenTheme } from './views/widgets/Themes'

import { Grid } from '@material-ui/core';
import FlashAppBar from './views/widgets/flashappbar'
import SplashScreen from './views/components/splashscreen';
import ErrorDialog from './views/components/errordialog';
import SynchroniseComponent from './views/components/synchronisecomponent';
import Settings from './views/components/settings';
import Admin from './views/components/admin';

function Cookies() {
  const split = document.cookie.split(';');
  const cookie = {};
  for (let index in split) {
    let splitedValue = split[index].split('=');
    if (splitedValue.length > 1) {
      cookie[splitedValue[0].trim()] = splitedValue[1].trim();
    }
  }
  return cookie;
}

function eraseCookie(name) {
  let _cookies = Cookies();
  let _cookie = _cookies[name];
  if (_cookie) {
    let _deleted = name + '=; Max-Age=-99999999'
    _cookie = JSON.parse(_cookie)
    if (_cookie.path) {
      _deleted += '; path=' + _cookie.path;
    }
    if (_cookie.domain) {
      _deleted += '; domain=' + _cookie.domain;
    }
    console.log("eraseCookie", _deleted);
    document.cookie = _deleted;
  }
}
class NavEvent {
  push(title) {
    window.history.pushState({ page: window.history.length }, title, "")
  }
  onBackButtonEvent(e) {
    //alert(window.history.length);
    if (this.backButton) {
      e.preventDefault();
      this.backButton();
    }
  }
  clear() {
    var _len = window.history.length;
    //while (_len-->2) {
    // alert(_len);
    // window.history.back();
    //}
    //alert(window.history.replaceState())
    //window.history.clear();
  }
}
const navEvent = new NavEvent();

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { /*splashScreenShowing: true*/ }
    this.createFlashDeck = this.createFlashDeck.bind(this)
    this.onFlashDeckSelected = this.onFlashDeckSelected.bind(this)
    this.goHome = this.goHome.bind(this)
    this.goGangs = this.goGangs.bind(this)
    this.createFlashGang = this.createFlashGang.bind(this)
    this.onFlashGangSelected = this.onFlashGangSelected.bind(this)
    this.onLoggedIn = this.onLoggedIn.bind(this)
    this.logOut = this.logOut.bind(this)
    this.goSettings = this.goSettings.bind(this)
    this.callSynchronise = false
    this.navEvent = navEvent;
    this.onSessionExpired = this.onSessionExpired.bind(this)
  }
  logOut() {
    console.log("Logging out bug before", Object.entries(localStorage).length);
    localStorage.clear();
    console.log("Logging out bug after", Object.entries(localStorage).length);
    //window.location.href = '/'
    this.setState({ mode: '', flashDeckId: null })
  }
  onSessionExpired(logout) {
    console.log("SESSIONBUG onSessionExpired is called");
    //localStorage.removeItem("flashJwt")
    //localStorage.removeItem("flashJwtRefresh");
    logout();
    //    alert("Session has expired, please log in again");
    this.setState({ mode: '', flashDeckId: null, error: "Session has expired, please log in again." });
  }
  createFlashDeck() {
    this.navEvent.push("DECK");
    this.setState({ mode: 'EDIT', flashDeckId: null })
  }
  onFlashDeckSelected(flashDeckId, mode, source) {
    this.navEvent.push("DECK");
    this.setState({ flashDeckId: flashDeckId, mode: mode, source: source })
  }
  onFlashGangSelected(flashGangId) {
    this.navEvent.push("GANG");
    this.setState({ flashGangId: flashGangId, mode: 'EDITGANG' })
  }
  createFlashGang() {
    this.navEvent.push("GANG");
    this.setState({ mode: 'EDITGANG', flashGangId: null })
  }
  goHome() {
    this.navEvent.clear();
    this.setState({ mode: '' })
  }
  goGangs() {
    this.navEvent.push("GANGS");
    this.setState({ mode: 'GANGS' })
  }
  goSettings() {
    this.navEvent.push("SETTINGS");
    this.setState({ mode: 'SETTINGS' })
  }
  onLoggedIn() {
    this.forceUpdate()
  }
  checkIfUserIsInScope() {
    //if (this.loggedIn) {
      //  return true
    //}
    let cookie = Cookies();
    console.log("COOKIES", cookie);
    if (cookie.socialLogin) {
      let parsedCookie = JSON.parse(cookie.socialLogin)
      console.log('parsedCookie', parsedCookie)
      if (parsedCookie.error) {
        this.setState({ error: parsedCookie.error })
      } else {
        //this.setState({})
        //localStorage.setItem("flashJwt", parsedCookie.jwt)
        //localStorage.setItem("flashJwtRefresh", parsedCookie.refresh)
        //this.synchroniseComponent.socialLogin(parsedCookie.jwt, parsedCookie.refresh, parsedCookie.user)
        console.log('parsedCookie', parsedCookie)
        this.socialLogin = { jwt: parsedCookie.jwt, refreshToken: parsedCookie.refresh, user: parsedCookie.user }
        //localStorage.setItem("currentUser", JSON.stringify(parsedCookie.user))
        //this.callSynchronise = true
      }
      eraseCookie('socialLogin');
      this.callSynchronise = false
    }
    var _jwt = localStorage.getItem("flashJwt");
    if (!_jwt) {
      this.loggedIn = false
      this.callSynchronise = false
    } else {
      this.loggedIn = true
      this.callSynchronise = true
    }
    return this.loggedIn
  }
  componentDidMount() {
    window.onpopstate = function (e) {
      navEvent.onBackButtonEvent(e);
    };
  }
  componentDidUpdate(){
    console.log('app.js update, this.state', this.state)
  }
  render() {
    const loggedIn = this.checkIfUserIsInScope()
    let renderable = <Home
      onNewButton={this.createFlashDeck}
      onFlashDeckSelected={this.onFlashDeckSelected}
      goGangs={this.goGangs}
      onLogOut={this.logOut}
      goSettings={this.goSettings}
    />
    if (!loggedIn) {
      renderable = <Login onLoggedIn={this.onLoggedIn}
        onLogOut={this.logOut}
      />
    } else if (this.state.mode == 'EDIT' || this.state.mode == 'TEST') {
      renderable = <FlashDeck
        goHome={this.goHome}
        onFlashDeckSelected={this.onFlashDeckSelected}
        flashDeckId={this.state.flashDeckId}
        source={this.state.source}
        mode={this.state.mode}
        goGangs={this.goGangs}
        onLogOut={this.logOut}
        goSettings={this.goSettings}
        navEvent={this.navEvent}
      />
    } else if (this.state.mode == 'GANGS') {
      renderable = <FlashGangs
        onFlashGangSelected={this.onFlashGangSelected}
        goHome={this.goHome}
        createFlashGang={this.createFlashGang}
        onLogOut={this.logOut}
        goSettings={this.goSettings}
        navEvent={this.navEvent}
      />
    } else if (this.state.mode == 'EDITGANG') {
      renderable = <FlashGangEditor
        onFlashDeckSelected={this.onFlashDeckSelected}
        goHome={this.goHome}
        flashGangId={this.state.flashGangId}
        onLogOut={this.logOut}
        goSettings={this.goSettings}
        goGangs={this.goGangs}
        navEvent={this.navEvent}
      />
    } else if (this.state.mode == 'SETTINGS') {
      renderable = <Settings
        onLogOut={this.logOut}
        goHome={this.goHome}
        goGangs={this.goGangs}
        navEvent={this.navEvent}
      />
    } else if (window.location.pathname.endsWith('/admin')) {
      renderable = <Admin
        goGangs={this.goGangs}
        onLogOut={this.logOut}
        goSettings={this.goSettings}
        goHome={this.goHome}
        navEvent={this.navEvent}
      />
    }
    //renderable=<TestGrid/>
    return (
      <Provider store={store}>
        <ThemeProvider theme={this.state.theme ? this.state.theme : greenTheme}>
          <Box height={'1'} style={{ overflowX: 'hidden', overflowY: 'scrolling' }}>
            <SynchroniseComponent
              callSynchronise={this.callSynchronise}
              onSessionExpired={this.onSessionExpired}
              socialLogin={this.socialLogin}
            />
            {/*<SplashScreen showing={this.state.splashScreenShowing} />*/}
            <ErrorDialog error={this.state.error} onClose={() => { this.setState({ error: null }) }} />
            {renderable}
          </Box>
        </ThemeProvider>
      </Provider>
    )
  }
}