import React from 'react';
import Zoom from 'react-reveal/Zoom';
import { withTheme } from '@material-ui/styles';

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
        this.state = { frameIndex: 0, animationFinished: false, handPosition: 125, cardPosition: -25 }
    }
    componentDidMount() {
        const interval = setInterval(() => {
            if (this.state.frameIndex == frames.length - 1) {
                clearInterval(interval)
                this.setState({animationFinished:true})
            } else {
                this.setState({ frameIndex: ++this.state.frameIndex, handPosition: this.state.handPosition-9, cardPosition: this.state.cardPosition+9 })
            }
        }, 35)
    }
    render() {
        return (
            <Zoom left when={this.props.showing}>
                <div style={{
                    zIndex: this.props.showing ? 99 : 0,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '100%',
                    backgroundColor: this.props.theme.palette.secondary.main
                }}>
                    <img
                        src={frames[this.state.frameIndex]}
                        style={{
                            position: 'absolute',
                            width: '50%',
                            left: '25%',
                            top: '50%'
                        }}
                    >

                    </img>
                    <img
                        src={splashLogoCard}
                        style={{
                            position: 'absolute',
                            width: '25%',
                            left: this.state.cardPosition+'%',
                            top: '15%',
                            display: !this.state.animationFinished ? '' : 'none'
                        }}
                    />
                    <img
                        src={splashLogoHand}
                        style={{
                            position: 'absolute',
                            width: '25%',
                            left: this.state.handPosition+'%',
                            top: '15%',
                            display: !this.state.animationFinished ? '' : 'none'
                        }}
                    />
                    <img
                        src={splashLogoComplete}
                        style={{
                            position: 'absolute',
                            width: '25%',
                            left: '37%',
                            top: '15%',
                            display: this.state.animationFinished ? '' : 'none'
                        }}
                    />
                </div>
            </Zoom>
        )
    }
}
const SplashScreen = withTheme(SplashScreenStyled);

export default SplashScreen