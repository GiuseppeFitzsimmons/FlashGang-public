import React from 'react';
import { withTheme } from '@material-ui/styles';
import { AwesomeButton } from "react-awesome-button";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../action'
import { MdDelete } from 'react-icons/md'
import IntegratedInput from '../widgets/IntegratedInput'
import { Button, Grid, GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import { FlashButton } from '../widgets/FlashBits'
import { FlashTypography } from '../widgets/FlashBits';
import { CSSTransition } from 'react-transition-group';
import '../../App.css';
import { QuestionImage } from '../widgets/question-image'

class FlashCardScoreStyled extends React.Component {
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
        setTimeout(() => {
            if (document.getElementById('block4')) {
                document.getElementById('block4').classList.remove('score-not-showing')
            }
        }, 600)

    }

    render() {
        const card = this.props.flashDeck.flashCards[this.props.flashDeck.currentIndex]
        const scoreCard = this
        let renderable = {}
        if (card.correct) {
            renderable =
                <>

                    <div class='score-showing score-not-showing' id='block1'>
                        <FlashTypography variant="h4" gutterBottom >
                            Correct answer!
                             </FlashTypography>
                    </div>
                    <div class='score-showing score-not-showing' id='block2'>
                        <FlashTypography variant="h4" gutterBottom correct>
                            {card.correctAnswers.join(', ')}
                        </FlashTypography>
                    </div>
                    <div class='score-showing score-not-showing' id='block3'>
                        {card.description &&

                            <FlashTypography variant="h4" gutterBottom correct>
                                {card.description}
                            </FlashTypography>

                        }
                    </div>
                </>
        } else {
            renderable =
                <>
                    <div class='score-showing score-not-showing' id='block1'>
                        <FlashTypography variant="h4" gutterBottom incorrect>
                            Incorrect Answer!
                    </FlashTypography>
                    </div>
                    {
                        //How about this? When in cram mode, you don't get to see the correct answer
                        this.props.flashDeck.testType != 'CRAM' &&
                        <>
                            <div class='score-showing score-not-showing' id='block2'>
                                <FlashTypography variant="h6" gutterBottom infolabel>
                                    The correct answer was:
                            </FlashTypography>
                                <FlashTypography variant="h5" gutterBottom correct>
                                    {card.correctAnswers.join(', ')}
                                </FlashTypography>
                            </div>
                            <div class='score-showing score-not-showing' id='block3'>
                                {card.description &&
                                    <FlashTypography variant="h6" gutterBottom>
                                        {card.description}
                                    </FlashTypography>
                                }
                            </div>
                        </>
                    }
                    <div class='score-showing score-not-showing' id='block4'>
                        <FlashTypography variant="h6" gutterBottom infolabel>
                            Your answer was:
                    </FlashTypography>
                        <FlashTypography variant="h5" gutterBottom incorrect>
                            {Array.isArray(card.userAnswer) ? card.userAnswer.join(', ') : card.userAnswer}
                        </FlashTypography>
                    </div>
                </>
        }
        return (
            <Grid container
                direction="row"
                justify="space-evenly"
                alignItems="flex-start"
                alignContent="space-between"
                style={{height:'100%'}}
                >
                <Grid item xs={12} sm={12}>
                    <FlashTypography variant="h4" gutterBottom infolabel>
                        {
                            card.image &&
                            <QuestionImage image={card.image}/>
                        }
                        <div class='score-showing'>
                        {card.question}
                        </div>
                    </FlashTypography>

                    {renderable}
                    <FlashButton
                        onClick={() => { this.props.onNextCard(this.props.flashDeck) }}
                        buttonType='action'
                        style={{ width: '100%' }}
                    >
                        Next Card
                    </FlashButton>
                </Grid>
            </Grid>
        )
    }
}
const FlashCardScore = withTheme(FlashCardScoreStyled);
export default FlashCardScore;