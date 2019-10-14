import React, { Component } from 'react'
import { connect } from 'react-redux';

import * as ACTIONS from '../store/actions/actions';
import axios from 'axios';
import history from '../utils/history';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';



class Users extends Component {
  componentDidMount() {
    axios.get('/api/get/allusers')
    .then(res => this.props.users_success(res.data))
    .catch(function (error) {
        console.log(error);
      });
   }

   state = {
     open: false,
     uid: null
   }

   handleClickOpen = (user_id) => {
      this.setState({ open: true, uid: user_id });
    };

    handleClose = () => {
      this.setState({ open: false });
    };

    handleDeleteUser = () => {
      const user_id = this.state.uid
      axios.delete('/api/delete/usercomments', { data: { uid: user_id }})
        .then(() => axios.get('/api/get/user_postids', { params: { uid: user_id }})
          .then(res => res.data.map(post => axios.delete('/api/delete/userpostcomments', { data: { post_id: post.pid }})) )
        )
        .then(() => axios.delete('/api/delete/userposts', { data: { uid: user_id }})
          .then(() => axios.delete('/api/delete/user', { data: { uid: user_id }} )
      ))
        .catch(function (error) {
          console.log(error);
        })
        .then(setTimeout( function() { history.replace('/') }, 700))
    }

  RenderUsers = (user) => (
    <TableRow>
      <TableCell>
      <br/>
      <p> { user.user.username } </p>
      <p> { user.user.email } </p>
      <br />
      <button onClick={() => this.handleClickOpen(user.user.uid)}> Delete User</button>
      </TableCell>
    </TableRow>
  );

  render() {
    return (
    <div>
      <h1>Users</h1>
      <div className="FlexRow">
      <Paper>
      <div className="FlexUsersTable">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell> User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
             { this.props.users ?
               this.props.users.map(user =>
               <this.RenderUsers key={ user.uid } user={user} />)
             : null
             }
          </TableBody>
        </Table>
      </div>
    </Paper>
    </div>

    <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"> Delete User </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Deleteing User will delete all posts and comments made by user
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {this.handleDeleteUser(); this.handleClose()} } color="primary">
            Delete
          </Button>
          <Button onClick={() => this.handleClose()} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
 </div>
    )
  }
}


function mapStateToProps(state) {
  return {
      users: state.user_reducer.all_users
  };
}

function mapDispatchToProps (dispatch) {
  return {
    users_success: (users) => dispatch(ACTIONS.get_all_users(users))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Users);
