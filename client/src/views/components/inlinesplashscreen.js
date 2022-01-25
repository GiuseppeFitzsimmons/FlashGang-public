import React from 'react';
import Zoom from 'react-reveal/Zoom';
import { withTheme } from '@material-ui/styles';
import { CSSTransition } from 'react-transition-group';
import '../../App.css'

var img1 = require('../../assets/splash-logotype-1.png')
var img3 = require('../../assets/splash-logotype-3.png')
var img4 = require('../../assets/splash-logotype-4.png')
var img5 = require('../../assets/splash-logotype-5.png')
var img6 = require('../../assets/splash-logotype-6.png')
var img7 = require('../../assets/splash-logotype-7.png')
var img8 = require('../../assets/splash-logotype-8.png')
var img9 = require('../../assets/splash-logotype-9.png')
var img10 = require('../../assets/splash-logotype-10.png')
var splashLogoCard = require('../../assets/splash-logo-card.png')
var splashLogoHand = require('../../assets/splash-logo-hand.png')
var splashLogoComplete = require('../../assets/splash-logo-complete.png')

const frames = [img1, img3, img4, img5, img6, img7, img8, img9, img10]

class SplashScreenStyled extends React.Component {
    constructor(props) {
        super(props)
        this.state = { frameIndex: 0, 
            animationFinished: false, 
            handPosition: 125, 
            cardPosition: -25, 
            fullSize: true, 
            logotypeLeft: 25, 
            logotypeTop: 50, 
            logotypeWidth: 20, 
            cardLogoLeft: 25, 
            cardLogoTop: 15, 
            cardLogoHeight: 30  }
    }
    componentDidMount() {
        const interval = setInterval(() => {
            if (this.state.frameIndex == frames.length - 1) {
                clearInterval(interval)
                this.setState({animationFinished:true});
                setTimeout(()=>{
                    this.setState({fullSize:false});
                    const secondInterval =  setInterval(()=> {
                        if (this.state.logotypeLeft<=5 && 
                            this.state.logotypeTop<=5 && 
                            this.state.logotypeWidth<=5 &&
                            this.state.cardLogoLeft<=25 && 
                            this.state.cardLogoTop<=5 && 
                            this.state.cardLogoHeight<=5) {
                            clearInterval(secondInterval);
                        } else {
                            this.setState({
                                logotypeLeft: this.state.logotypeLeft<=5 ? 5 : this.state.logotypeLeft-5,
                                logotypeTop: this.state.logotypeTop<=3 ? 2 : this.state.logotypeTop-7,
                                logotypeWidth: this.state.logotypeWidth<=7 ? 7 : this.state.logotypeWidth-5,
                                cardLogoLeft: this.state.cardLogoLeft<=25 ? 25 : this.state.cardLogoLeft-3,
                                cardLogoTop: this.state.cardLogoTop<=3 ? 2 : this.state.cardLogoTop-7,
                                cardLogoHeight: this.state.cardLogoHeight<=7 ? 7 : this.state.cardLogoHeight-7
                            })
                        }
                    }, 25)
                }, 750)
            } else {
                this.setState({ frameIndex: ++this.state.frameIndex, handPosition: this.state.handPosition-9, cardPosition: this.state.cardPosition+9 })
            }
        }, 35)
    }
    render() {
        return (
            <CSSTransition
                in={this.state.fullSize}
                timeout={500}
                classNames="splash"
            >
            <div class='splash-enter' style={{backgroundColor:'rgb(139, 195, 74)'}}>
                    <img
                        src={frames[this.state.frameIndex]}
                        style={{
                            position: 'absolute',
                            height: this.state.logotypeWidth+'%',
                            left: this.state.logotypeLeft+'%',
                            top: this.state.logotypeTop+'%'
                        }}
                    />
                    <img
                        src={splashLogoCard}
                        style={{
                            position: 'absolute',
                            height: '30%',
                            left: this.state.cardPosition+'%',
                            top: '15%',
                            display: !this.state.animationFinished ? '' : 'none'
                        }}
                    />
                    <img
                        src={splashLogoHand}
                        style={{
                            position: 'absolute',
                            height: '30%',
                            left: this.state.handPosition+'%',
                            top: '15%',
                            display: !this.state.animationFinished ? '' : 'none'
                        }}
                    />
                    <img
                        src={splashLogoComplete}
                        style={{
                            position: "absolute",
                            height: this.state.cardLogoHeight+'%',
                            left: this.state.cardLogoLeft+'%',
                            top: this.state.cardLogoTop+'%',
                            display: this.state.animationFinished ? '' : 'none'
                        }}
                    />
                </div>
                </CSSTransition>
        )
    }
}
const InlineSplashScreen = withTheme(SplashScreenStyled);

export default InlineSplashScreen