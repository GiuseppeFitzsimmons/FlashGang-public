
import lightGreen from '@material-ui/core/colors/lightGreen';
import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

const greenTheme = createMuiTheme({
    palette: {
      primary: { main: lightGreen[500], color: 'white', selected: lightGreen[500], overlay:'rbga(0,0,0,0.6)' },
      default: { main: lightGreen[500], overlay:'rbga(0,0,0,0.6)' },
      secondary: { main: lightGreen[500], selected: lightGreen[300], overlay:'rbga(0,0,0,0.6)' }
    },
    overrides: {
      MuiButton: {
        root: {
          marginTop: "10px",
          color: 'white'
        }
      },
      MuiBox: {
        root: {
          backgroundColor: lightGreen[100],
          padding: "10px",
          height:'100%',
          borderColor: lightGreen[500],
          borderWidth: '5px',
          overflowY: 'scrolling'
        }
      },
      MuiListItemAvatar: {
        root: {
          color: lightGreen[500]
        }
      },
      MuiListItem: {
        gutters: {
          paddingLeft: 4,
          paddingRight: 4
        }
      },
      MuiInputBase: {
        paddingLeft:0,
        paddingRigth:0
      },
      MuiDialogTitle: {
        root: {
          backgroundColor: lightGreen[300],
          color: 'white'
        }
      },
      MuiDialogContent: {
        root: {
          backgroundColor: lightGreen[100],
          color: lightGreen[500]
        }
      },
      MuiDialogActions: {
        root: {
          backgroundColor: lightGreen[300],
          color: lightGreen[500]
        }
      },
      PrivateRadioButtonIcon: {
        root: {
          color: lightGreen[500]
        }
      },
      PrivateSwitchBase: {
        root: {
          color: lightGreen[500]
        },
        secondary: {
          color: lightGreen[500]
        }
      },
      MuiCheckbox: {
        root: {
          color: lightGreen[500]
        },
        secondary: {
          color: lightGreen[500]
        }
      },
      MuiIconButton: {
        root: {
          color: lightGreen[500]
        },
        secondary: {
          color: lightGreen[500]
        }
      },
      MuiPaper: {
        root: {
          backgroundColor: lightGreen[100]
        },
        secondary: {
          color: lightGreen[500]
        }
      },
      MuiContainer: {
        root: {
          paddingLeft: '4px',
          paddingRight: '4px'
        }
      },
      MuiAvatar: {
        root: {
          borderRadius: '0',
          width: '20%',
          height: 'auto'
        }
      },
      MuiGridList: {
        root: {
          margin: '0px'
        }
      }
    },
    systemButton: {
      backgroundColor: lightGreen[500],
      color: 'white'
    },
    actionButton: {
      backgroundColor: lightGreen[500],
      color: 'white'
    },
    errorButton: {
      backgroundColor: red[400],
      color: 'white'
  
    },
    listItem: {
      backgroundColor: lightGreen[200],
      borderRadius: 0,
      borderColor: lightGreen[500],
      borderWidth: 1
    },
    actionListItem: {
      backgroundColor: lightGreen[200]
    },
    correct: {
      color: lightGreen[400]
    },
    incorrect: {
      color: red[400]
    },
    label: {
      color: 'white',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      content:'',
      display: 'block'
    },
    sublabel: {
      color: 'rgba(255,255,255,0.8)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      content:'',
      display: 'block' 
    },
    infolabel: {
      color: 'rgba(0,0,0,0.4)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      content:'',
      display: 'block'
    },
    disabled: {
      color: 'rgba(0,0,0,0.6)',
      backgroundColor: lightGreen[200]
    },
    icon: {
      color: lightGreen[500]
    }
  });

  export {
      greenTheme
  }