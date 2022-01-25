import React from 'react';
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import { FlashButton } from '../widgets/FlashBits'
import { FlashTypography } from '../widgets/FlashBits';
import '../../App.css';

export default class FlashDeckScore extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            if (document.getElementById('block1')) {
                document.getElementById('block1').classList.remove('score-not-showing')
            }
        }, 150)
        setTimeout(() => {
            if (document.getElementById('block2')) {
                document.getElementById('block2').classList.remove('score-not-showing')
            }
        }, 300)
        setTimeout(() => {
            if (document.getElementById('block3')) {
                document.getElementById('block3').classList.remove('score-not-showing')
            }
        }, 450)

    }
    render() {
        let correctAnswers = 0
        let incorrectAnswers = 0
        let percentage = 0
        for (var i in this.props.flashDeck.flashCards) {
            let card = this.props.flashDeck.flashCards[i]
            if (card.correct) {
                correctAnswers++
            } else {
                incorrectAnswers++
            }
        }
        if (correctAnswers > 0) {
            percentage = (correctAnswers / this.props.flashDeck.flashCards.length) * 100
            percentage = percentage.toString()
            percentage.substr(0, 4)
        }
        return (
            <Grid container
                direction="column"
                justify="space-between"
                alignItems="flex-start">
                <div class='score-showing score-not-showing' id='block1'>
                    <FlashTypography variant="h5" gutterBottom correct>
                        Correct answers: {correctAnswers}
                    </FlashTypography>
                </div>
                <div class='score-showing score-not-showing' id='block2'>
                    <FlashTypography variant="h6" gutterBottom incorrect>
                        Incorrect answers: {incorrectAnswers}
                    </FlashTypography>
                </div>
                <div class='score-showing score-not-showing' id='block3'>
                    <FlashTypography variant="h5" gutterBottom incorrect={percentage < 50} correct={percentage > 50}>
                        {percentage}% Correct
                </FlashTypography>
                </div>
                <Grid container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-start"
                >

                    <FlashButton
                        buttonType='system'
                        icon='repeat'
                        style={{ width: '49%' }}
                        onClick={this.props.onStartOver}
                    >
                        Retry
                </FlashButton>
                    <FlashButton
                        buttonType='system'
                        icon='home'
                        style={{ width: '49%' }}
                        onClick={this.props.goHome}
                    >
                        Home
                </FlashButton>
                </Grid>
            </Grid>
        )
    }
}
