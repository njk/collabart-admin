import { createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';

const myTheme = createMuiTheme({
    palette: {
    	type: 'light',
        primary: lightBlue,
        secondary: lightBlue,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    appBar: {
    	backgroundColor: '#ffffff'
    },
    overrides: {
        AppBar: { // override the styles of all instances of this component
            root: { // Name of the rule
                backgroundColor: '#ffffff', // Some CSS
            },
        },
    },
});

export default myTheme;