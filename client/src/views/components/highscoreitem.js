import React from 'react';
import { Button, Grid, GridList, Container } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import IntegratedInput from '../widgets/IntegratedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
//https://react-icons.netlify.com/#/icons/md
import { MdDelete, MdModeEdit } from 'react-icons/md';
//https://react-icons.netlify.com/#/icons/gi
import { GiSwordman, GiHoodedFigure, GiBrutalHelm } from 'react-icons/gi';
import Paper from 'material-ui/Paper';
import { FlashButton, FlashListItem } from '../widgets/FlashBits';


class HighScoreItemStyled extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let name;
        let score;
        let highScore;
        if (this.props.score) {
            name = this.props.score.id
            if (this.props.score.firstName && this.props.score.lastName) {
                name = this.props.score.firstName + ' ' + this.props.score.lastName
            }
            score = this.props.score.score
            highScore = this.props.score.highScore
        } else {
            name = 'Name'
            score = 'Score'
            highScore = 'High'
        }
        return (
            <Grid container spacing={0} style={{ paddingTop: '4px' }}>
                <Grid container xs={12} sm={12} md={12} style={this.props.theme.actionListItem} direction='row'>
                    <Grid
                        xs={8} sm={8} md={8}
                    >
                        {name}
                    </Grid>
                    <Grid container
                        xs={2} sm={2} md={2}
                        alignContent='center'
                        justify='center'
                    >
                        {score}
                    </Grid>
                    <Grid container
                        xs={2} sm={2} md={2}
                        direction="column"
                        alignItems="center"
  justify="center"
                    >
                        {highScore}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}
const HighScoreItem = withTheme(HighScoreItemStyled);
export {
    HighScoreItem
}