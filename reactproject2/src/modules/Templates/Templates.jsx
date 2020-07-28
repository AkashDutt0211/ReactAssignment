import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { CircularProgress } from '@material-ui/core';
import callApi from '../../libs/api';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';

const styles = () => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 300,
  },
});

class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false,
        avatar: "",
        email: "",
        first_name: "",
        last_name: "",
        id: 0,
    };
  }

  getUserDetails = (id) => {
      this.setState( { isLoading: true})
    callApi({}, `/users/${id}`, 'get').then((response) => {
        const { data : { data : {avatar, email, first_name, last_name, id}}} = response;
      this.setState({
        avatar,
        email,
        first_name,
        last_name,
        id,
        isLoading: false,
      })
    });
  }

  componentDidMount = () => {
    const { location: {state : { userId }} } = this.props;
    this.getUserDetails(userId);
  }

  render() {
    const { classes } = this.props;
    const { isLoading, first_name, last_name, email, avatar, id } = this.state;
    if (!isLoading) {
      return (
        <>
          <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
          className={classes.media}
          image={avatar}
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  {first_name+ " " + last_name}
                </Typography>
                <Typography variant="h6">
                  {email}
                </Typography>
              </CardContent>
            </div>
            </CardActionArea>
          <CardActions>
            <Link component={RouterLink} to="/list">
              <Button size="small" color="primary">
                BACK
              </Button>
            </Link>
          </CardActions>
          </Card>
        </>
      );
    }
    return <CircularProgress />;
  }
}
Templates.propTypes = {
  classes: PropTypes.element.isRequired,
  match: PropTypes.objectOf(PropTypes.object).isRequired,
};
export default withStyles(styles)(Templates);
