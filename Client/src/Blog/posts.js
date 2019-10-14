 import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import * as ACTIONS from '../store/actions/actions';
import axios from 'axios';
import moment from 'moment';
import history from '../utils/history';
import Button from '@material-ui/core/Button';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';







class Posts extends Component {
  constructor(props) {
      super(props)

    this.state = {
       open: false,
       post_id: null
     }
  }

  componentDidMount() {
    axios.get('/api/get/allposts')
      .then(res => this.props.set_posts(res.data))
      .catch((err) => console.log(err))
  }


   handleClickOpen = () => {
      this.setState({ open: true });
    };

    handleClose = () => {
      this.setState({ open: false, post_id: null });
    };

    DeletePost = () => {
     const post_id = this.state.post_id
     axios.delete('api/delete/postcomments', { data: { post_id: post_id }})
     .then(() =>{ axios.delete('api/delete/post', { data: { post_id: post_id }})
        .then(res => console.log(res))  })
     .catch(function (error) {
         console.log(error);
       })
     .then(() => this.handleClose())
     .then(() => setTimeout( function() { history.replace('/') }, 700))
   }


  handleSearch = (event) => {
    const search_query = event.target.value
    axios.get('/api/get/searchpost', {params: {search_query: search_query} })
    .then(res => this.props.search_posts_success(res.data))
    .catch(function (error) {
      console.log(error);
      })
  }

  DeletePost = () => {
      const post_id = this.state.post_id
      axios.delete('api/delete/postcomments', { data: { post_id: post_id }})
      .then(() =>{ axios.delete('api/delete/post', { data: { post_id: post_id }})
         .then(res => console.log(res))  })
      .catch(function (error) {
          console.log(error);
        })
      .then(() => this.handleClose())
      .then(() => setTimeout( function() { history.replace('/') }, 700))
    }



  RenderPosts = (post) => (
     <TableRow>
         <TableCell><Link to={{pathname:"/post/" + post.post.pid, state:{post} }}><h4> { post.post.title }</h4></Link>
           <p> { post.post.body } </p>
           <small> { post.post.date_created } </small>
           <p> By: { post.post.author} </p>
           <button><Link to={{pathname:"/editpost/" + post.post.pid, state:{post} }}>Edit</Link></button>
           <button onClick={() => this.setState({open: true, post_id: post.post.pid})}>Delete</button>
         <br/>
      </TableCell>
     </TableRow>
   )


  render(){
    return(
        <div>
        <div style={{opacity: this.state.opacity, transition: 'opacity 2s ease'}}>
        <br />
           <Link to="/addpost">
              <Button variant="contained" color="primary">
                Add Post
              </Button>
            </Link>
        </div>
        <TextField
          id="search"
          label="Search"
          margin="normal"
          onChange={this.handleSearch}
        />
        <hr />
        <hr />
        <div className='FlexRow'>
        <Table>
         <TableHead>
           <TableRow>
             <TableCell> <strong> Search Results </strong> </TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
              { this.props.db_search_posts  ?
                this.props.db_search_posts.map(post =>
                <this.RenderPosts key={ post.pid } post={post} />)
              : null
              }
           </TableBody>
         </Table>
        <br />
        </div>

        <h1>All Posts</h1>
        <div className="FlexRow">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Posts </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
               { this.props.posts ?
                 this.props.posts.map(post =>
                 <this.RenderPosts key={ post.pid } post={post} />)
               : null
               }
            </TableBody>
          </Table>
        </div>
        <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title"> Confirm Delete? </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deleteing Post
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.DeletePost()} color="primary" autoFocus>
              Agree
            </Button>
            <Button onClick={() => this.handleClose()} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        </div>
    )}
}


function mapStateToProps(state) {
  return {
    posts: state.posts_reducer.posts,
    is_authenticated: state.auth_reducer.is_authenticated,
    db_search_posts: state.posts_reducer.db_search_posts
  }
}

function mapDispatchToProps(dispatch) {
  return {
    set_posts: (posts) => dispatch(ACTIONS.fetch_db_posts(posts)),
    search_posts_success: (posts) => dispatch(ACTIONS.fetch_search_posts(posts)),
    remove_search_posts: () => dispatch(ACTIONS.remove_search_posts())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Posts)
