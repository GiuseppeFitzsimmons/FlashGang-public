import React from 'react';
import { HighScoreItem } from './highscoreitem';
import { Button, Grid, GridList, Container } from '@material-ui/core';

export default class HighScores extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                {this.generateHighScoreList()}
            </div>
        )
    }
    generateHighScoreList = () => {
        var list;
        if (this.props.flashDeck.source == 'GANGS') {
            list = this.props.flashDeck.scores.sort((a, b) => {
                var highScoreA = a.highScore ? a.highScore : 0
                var highScoreB = b.highScore ? b.highScore : 0
                return highScoreB - highScoreA
            })
        } else {
            console.log('this.props.user', this.props.user, 'this.props.flashDeck.scores', this.props.flashDeck.scores)
            list = this.props.flashDeck.scores.filter((score) => {
                return score.userId == this.props.user.id
            })
        }
        list = this.props.flashDeck.scores.filter((score) => {
            return score.score || score.highScore || score.score == 0 
        })
        var _display = list.map((score, i) => {
            return (
                <>
                    <HighScoreItem
                        score={score}
                    />
                </>
            )
        })
        if (list && list.length > 0) {
            console.log('this.props.flashDeck.scores', this.props.flashDeck.scores)
            return (
                <>
                    <HighScoreItem
                    />
                    {_display}
                </>
            )
        } else {
            return (
                <>
                </>
            )

        }
    }
}

