import { withTheme } from '@material-ui/styles';
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

class QuestionImageStyled extends Component {
    render() {
        return (
            <Paper elevation={4} style={{
                backgroundImage: `url(${this.props.image}`, paddingTop:'50%', 
                backgroundSize:'cover',
                backgroundRepeat:'no-repeat',
                backgroundPosition: 'top'
                }}>
                
            </Paper>
        )
    }
}

const QuestionImage = withTheme(QuestionImageStyled);

export {
    QuestionImage
}