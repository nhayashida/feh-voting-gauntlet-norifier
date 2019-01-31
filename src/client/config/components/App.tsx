import {
  createMuiTheme,
  createStyles,
  CssBaseline,
  FormControl,
  IconButton,
  InputLabel,
  MuiThemeProvider,
  NativeSelect,
  Snackbar,
  SnackbarContent,
  Theme,
  WithStyles,
} from '@material-ui/core';
import { Close as CloseIcon, Error as ErrorIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px`,
    },
    formControl: {
      marginBottom: theme.spacing.unit * 4,
    },
    notificationContent: {
      backgroundColor: theme.palette.error.main,
    },
    notificationMessage: {
      display: 'flex',
      alignItems: 'center',
      wordBreak: 'break-all',
      '& svg': {
        marginRight: theme.spacing.unit,
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  heroes: string[];
  channels: Slack.Channel[];
  settings: UserSettings;
  errorMessage: string;
  initialize: () => void;
  updateSettings: (props: { [key: string]: string }) => void;
  hideErrorMessage: () => void;
}

const mapStateToProps = (state: Props) => ({
  heroes: state.heroes,
  channels: state.channels,
  settings: state.settings,
  errorMessage: state.errorMessage,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

// tslint:disable-next-line:variable-name
const EmptyOption = (
  <option key="" value="">
    ...
  </option>
);

class App extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      settingsOpen: false,
    };
  }

  componentDidMount() {
    this.props.initialize();
  }

  onSelectChange = (e: SyntheticEvent<HTMLSelectElement>) => {
    this.props.updateSettings({
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  generateSelects(): JSX.Element[] {
    const { classes, heroes, channels, settings } = this.props;

    const selectProps = [
      {
        id: 'hero',
        label: 'Hero',
        value: settings.hero,
        options: [
          EmptyOption,
          ...heroes.map((hero, i) => (
            <option key={i} value={hero}>
              {hero}
            </option>
          )),
        ],
      },
      {
        id: 'channel',
        label: 'Channel',
        value: settings.channel,
        options: [
          EmptyOption,
          ...channels.map(channel => (
            <option key={channel.id} value={channel.id}>
              {channel.name}
            </option>
          )),
        ],
      },
    ];
    return selectProps.map(props => (
      <FormControl key={props.id} className={classes.formControl}>
        <InputLabel htmlFor={props.id} shrink={true}>
          {props.label}
        </InputLabel>
        <NativeSelect name={props.id} value={props.value} onChange={this.onSelectChange}>
          {props.options}
        </NativeSelect>
      </FormControl>
    ));
  }

  generateNotification() {
    const { classes, errorMessage, hideErrorMessage } = this.props;

    const message = (
      <span className={classes.notificationMessage}>
        <ErrorIcon />
        {errorMessage}
      </span>
    );
    const action = (
      <IconButton key="close" aria-label="Close" color="inherit" onClick={hideErrorMessage}>
        <CloseIcon />
      </IconButton>
    );

    return (
      <Snackbar open={!!errorMessage} autoHideDuration={1000 * 10} onClose={hideErrorMessage}>
        <SnackbarContent
          className={classes.notificationContent}
          message={message}
          action={[action]}
        />
      </Snackbar>
    );
  }

  render(): JSX.Element {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.root}>
          {this.generateSelects()}
          {this.generateNotification()}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(App));
