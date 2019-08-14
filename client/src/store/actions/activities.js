/* eslint-disable no-console */
import * as actionTypes from './actionTypes';
import API from '../../utils/apiRequests';
import { normalize } from '../utils';
import * as loading from './loading';

export const gotActivities = (activities) => ({
  type: actionTypes.GOT_ACTIVITIES,
  byId: activities.byId,
  allIds: activities.allIds,
});

export const addActivity = (activity) => ({
  type: actionTypes.ADD_ACTIVITY,
  activity,
});

export const updatedActivity = (id, body) => {
  return {
    type: actionTypes.UPDATED_ACTIVITY,
    id,
    body,
  };
};

export const updatedActivityTab = (activityId, tabId, body) => {
  return {
    type: actionTypes.UPDATED_ACTIVITY_TAB,
    activityId,
    tabId,
    body,
  };
};

export const addCourseActivities = (courseId, activityIdsArr) => ({
  type: actionTypes.ADD_COURSE_ACTIVITIES,
  courseId,
  activityIdsArr,
});

export const removeCourseActivities = (courseId, activityIdsArr) => {
  return {
    type: actionTypes.REMOVE_COURSE_ACTIVITIES,
    courseId,
    activityIdsArr,
  };
};

export const addUserActivities = (newActivitiesArr) => {
  return {
    type: actionTypes.ADD_USER_ACTIVITIES,
    newActivitiesArr,
  };
};

export const removeUserActivities = (activityIdsArr) => {
  return {
    type: actionTypes.REMOVE_USER_ACTIVITIES,
    activityIdsArr,
  };
};

export const setActivityStartingPoint = (id) => {
  return (dispatch, getState) => {
    const tabs = getState().activities.byId[id].tabs.map((tab) => {
      tab.startingPoint = tab.currentState;
      tab.currentState = tab.currentState;
      tab.events = [];
      return tab;
    });
    dispatch(updatedActivity(id, { tabs }));
    Promise.all(
      tabs.map((tab) =>
        API.put('tabs', tab._id, {
          events: [],
          startingPoint: tab.startingPoint,
          currentState: tab.currentState,
        })
      )
    )
      .then()
      .catch((err) => console.log('ER w THT: ', err));
  };
};

export const clearCurrentActivity = () => {
  return {
    type: actionTypes.CLEAR_ACTIVITY,
  };
};

export const createdActivity = (resp) => {
  const newActivity = resp;
  return {
    type: actionTypes.CREATED_ACTIVITY,
    newActivity,
  };
};

export const activitiesRemoved = (activityIds) => {
  return {
    type: actionTypes.REMOVE_ACTIVITIES,
    activityIds,
  };
};

export const getActivities = (params) => {
  return (dispatch) => {
    dispatch(loading.start());
    API.get('activities', params)
      .then((res) => {
        // Normalize res
        const activities = normalize(res.data.results);
        dispatch(gotActivities(activities));
        dispatch(loading.success());
      })
      .catch((err) => {
        dispatch(loading.fail());
        console.log(err);
      });
  };
};

export const getCurrentActivity = (id) => {
  return (dispatch) => {
    dispatch(loading.start());
    API.getById('activities', id)
      .then((res) => {
        dispatch(loading.success());
        dispatch(addActivity(res.data.result));
      })
      .catch((err) => {
        dispatch(loading.fail());
        console.log(err);
      });
  };
};

export const createActivity = (body) => {
  return (dispatch) => {
    dispatch(loading.start());
    API.post('activities', body)
      .then((res) => {
        const { result } = res.data;
        dispatch(createdActivity(result));
        if (body.course) {
          dispatch(addCourseActivities(body.course, [result._id]));
        }
        dispatch(addUserActivities([result._id]));
        return dispatch(loading.success());
      })
      .catch((err) => {
        dispatch(loading.fail(err));
      });
  };
};

export const updateActivityTab = (activityId, tabId, body) => {
  return (dispatch) => {
    dispatch(updatedActivityTab(activityId, tabId, body));
    API.put('tabs', tabId, body)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };
};

export const copyActivity = (activityId, userId, courseId) => {
  return (dispatch, getState) => {
    const activity = { ...getState().activities.byId[activityId] };
    activity.source = activity._id;
    delete activity._id;
    delete activity.rooms;
    delete activity.course;
    activity.creator = userId;
    activity.course = courseId;
    dispatch(createActivity(activity));
  };
};

// @TODO MAKE SURE ONLY CREATOR CAN REMOVE
export const removeActivity = (activityId) => {
  return (dispatch) => {
    dispatch(loading.start());
    API.remove('activities', activityId)
      .then((res) => {
        dispatch(removeUserActivities([activityId]));
        dispatch(removeCourseActivities(res.data.result.course, [activityId]));
        dispatch(activitiesRemoved([activityId]));
        dispatch(loading.success());
      })
      .catch((err) => dispatch(loading.fail(err.response.data.errorMessage)));
  };
};

export const updateActivity = (id, body) => {
  return (dispatch, getState) => {
    const activity = { ...getState().activities.byId[id] };
    if (body.isTrashed) {
      dispatch(removeUserActivities([id]));
      dispatch(activitiesRemoved([id]));
    } else {
      dispatch(updatedActivity(id, body)); // THIS ONE's OPTIMISITC
    }
    // dispatch(loading.start())
    API.put('activities', id, body)
      .then(() => {
        // dispatch(loading.success())
      })
      .catch(() => {
        // Undo changes
        const keys = Object.keys(body);
        if (body.isTrashed) {
          dispatch(createdActivity(activity));
          if (activity.course) {
            dispatch(addCourseActivities(activity.course, [activity._id]));
          }
          dispatch(addUserActivities([activity._id]));
        } else {
          const prevActivity = {};
          keys.forEach((key) => {
            prevActivity[key] = activity[key];
          });
          dispatch(updatedActivity(id, prevActivity));
        }
        dispatch(loading.updateFail('activity', keys));
        setTimeout(() => {
          dispatch(loading.clearLoadingInfo());
        }, 2000);
      });
  };
};

export const createdActivityConfirmed = () => {
  return {
    type: actionTypes.CREATE_ACTIVITY_CONFIRMED,
  };
};
