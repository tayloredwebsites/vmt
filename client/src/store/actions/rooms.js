import * as actionTypes from './actionTypes';
import API from '../../utils/apiRequests';
import { normalize } from '../utils/normalize';
import { addUserRooms, removeUserRooms } from './user';
import { addCourseRooms, removeCourseRooms } from './courses';
import { addActivityRooms, } from './activities';
import * as loading from './loading'

export const gotRooms = (rooms) => ({
  type: actionTypes.GOT_ROOMS,
  byId: rooms.byId,
  allIds: rooms.allIds
})

// export const gotRoom = room => ({
//   type: actionTypes.GOT_ROOM,
//   room,
// })

export const updateRoom = (roomId, body) => {
  return {
    type: actionTypes.UPDATE_ROOM,
    roomId,
    body,
  }
}

export const clearCurrentRoom = () => {
  return {
    type: actionTypes.CLEAR_ROOM
  }
}

export const createdRoom = resp => {
  const newRoom = resp
  return {
    type: actionTypes.CREATED_ROOM,
    newRoom,
  }
}

export const removedRoom = id => {
  return {
    type: actionTypes.REMOVE_ROOM,
    id,
  }
}

export const addRoomMember = (roomId, body) => {
  return {
    type: actionTypes.ADD_ROOM_MEMBER,
    roomId,
    body,
  }
}

// export const removeRoomMember = (roomId, userId) => {
//   return {
//     type: actionTypes.REMOVE_ROOM_MEMBER,
//     roomId,
//     userId,
//   }
// }

export const removeRoomMember = (roomId, userId) => {
  return dispatch => {
    dispatch(loading.start())
    API.delete('rooms', roomId, userId)
    .then(res => {
      dispatch(updateRoom(res.data.result))
    })
    .catch(err => dispatch(loading.fail(err)))
  }
}

export const getRooms = params => {
  return dispatch => {
    dispatch(loading.start())
    API.get('rooms', params)
    .then(res => {
      // Normalize res
      const rooms = normalize(res.data.results)
      dispatch(gotRooms(rooms))
      dispatch(loading.success())
    })
    .catch(err => dispatch(loading.fail(err)));
  }
}

export const populateRoom = id => {
  return dispatch => {
    dispatch(loading.start())
    API.getById('rooms', id)
    .then(res => {
      dispatch(updateRoom(id, res.data.result))
      dispatch(loading.success())
    })
    .catch(err => dispatch(loading.fail(err)))
  }
}

export const createRoom = body => {
  return dispatch => {
    dispatch(loading.start())
    API.post('rooms', body)
    .then(res => {
      let result = res.data.result;
      dispatch(createdRoom(result))
      if (body.course) {
        dispatch(addCourseRooms(body.course, [result._id]))
      }
      if (body.activity) {
        dispatch(addActivityRooms(body.activity, [result._id]))
      }
      dispatch(addUserRooms([result._id]))
      return dispatch(loading.success())
    })
    .catch(err => {
      dispatch(loading.fail(err))
    })
  }
}

export const updateRoomMembers = (roomId, updatedMembers) => {

  return dispatch => {
    API.updateMembers('rooms', roomId, updatedMembers)
    .then(res => {
      dispatch(updateRoom(roomId, res.data.result))
    })
    .catch(err => console.log(err))
  }
}

export const removeRoom = roomId => {
  return dispatch => {
    dispatch(loading.start())
    API.remove('rooms', roomId)
    .then(res => {
      dispatch(removeUserRooms([roomId]));
      if (res.data.result.course) {
        dispatch(removeCourseRooms(res.data.result.course, [roomId]))
      }
      dispatch(removedRoom(roomId))
      dispatch(loading.success())
    })
  }
}

export const createdRoomConfirmed = () => {
  return {
    type: actionTypes.CREATE_ROOM_CONFIRMED,
  }
}
