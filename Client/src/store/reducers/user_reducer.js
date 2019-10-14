import * as ACTION_TYPES from '../actions/action_types'


const initialState = {
  user_text: '',
  OtherUserDBProfile: null,
  db_other_user_posts: [],
  UserMessages: [],
  db_appointments: [],
  all_users: []
}


const UserReducer = (state = initialState, action) => {
    switch(action.type) {
      case ACTION_TYPES.USER_INPUT:
        return {
          ...state,
          user_text: action.payload
        }
      case ACTION_TYPES.SET_OTHER_USER_DB_PROFILE:
            return {
              ...state,
              OtherUserDBProfile: action.payload
            }
      case ACTION_TYPES.REMOVE_OTHER_USER_DB_PROFILE:
        return {
          ...state,
          OtherUserDBProfile: null
        }
      case ACTION_TYPES.FETCH_OTHER_USER_DB_POSTS_SUCCESS:
        return {
          ...state,
          db_other_user_posts: action.payload
        }
      case ACTION_TYPES.REMOVE_OTHER_USER_DB_POSTS:
        return {
          ...state,
          db_other_user_posts: []
        }
      case ACTION_TYPES.SET_USER_MESSAGES:
        return {
          ...state,
          UserMessages: action.payload
        }
      case ACTION_TYPES.REMOVE_USER_MESSAGES:
        return {
          ...state,
          UserMessages: []
        }
        case ACTION_TYPES.APPOINTMENTS_SUCCESS:
          return {
            ...state,
            db_appointments: action.payload
          }
        case ACTION_TYPES.GET_ALL_USERS:
          return {
            ...state,
            all_users: action.payload
          }
        case ACTION_TYPES.REMOVE_ALL_USERS:
          return {
            ...state,
            all_users: []
          }
      default:
        return state
    }
}

export default UserReducer;
