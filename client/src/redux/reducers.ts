import { Message, SEND_MESSAGE, DELETE_MESSAGE, ChatActionTypes } from './types';
import { SystemState, UPDATE_SESSION, SystemActionTypes, ChatState } from './types'

// TypeScript infers that this function is returning SendMessageAction
export function sendMessage(newMessage: Message): ChatActionTypes {
  return {
    type: SEND_MESSAGE,
    payload: newMessage
  }
}

// TypeScript infers that this function is returning DeleteMessageAction
export function deleteMessage(timestamp: number): ChatActionTypes {
  return {
    type: DELETE_MESSAGE,
    meta: {
      timestamp
    }
  }
}


export function updateSession(newSession: SystemState): SystemActionTypes {
  return {
    type: UPDATE_SESSION,
    payload: newSession
  }
}


  
  const initialState: ChatState = {
    messages: []
  }

export function chatReducer(
    state = initialState,
    action: ChatActionTypes
  ): ChatState {
    switch (action.type) {
      case SEND_MESSAGE:
        return {
          messages: [...state.messages, action.payload]
        }
      case DELETE_MESSAGE:
        return {
          messages: state.messages.filter(
            message => message.timestamp !== action.meta.timestamp
          )
        }
      default:
        return state
    }
  }

const initialSystemState: SystemState = {
  loggedIn: false,
  session: '',
  userName: ''
}

export function systemReducer(
  state = initialSystemState,
  action: SystemActionTypes
): SystemState {
  switch (action.type) {
    case UPDATE_SESSION: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}