import React, { Component } from 'react';
import WorkspaceLayout from '../../Layout/Room/Workspace/Workspace';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/';
import DesmosReplayer from './DesmosReplayer';
import GgbReplayer from './GgbReplayer';
import ChatReplayer from './ChatReplayer';
import ReplayControls from '../../Components/Replayer/ReplayerControls';
import moment from 'moment';
const MAX_WAIT = 10000; // 10 seconds
const BREAK_DURATION = 2000;
const PLAYBACK_FIDELITY = 100;
class Replayer extends Component {

  state = {
    playing: false,
    playbackSpeed: 1,
    logIndex: 0,
    timeElapsed: 0, // MS
    absTimeElapsed: 0,
    changingIndex: false,
    currentMembers: [],
    startTime: '',
  }

  log = this.props.room.events
    .concat(this.props.room.chat)
    .sort((a, b) => a.timestamp - b.timestamp);
  endTime = moment
    .unix(this.log[this.log.length - 1].timestamp / 1000)
    .format('MM/DD/YYYY h:mm:ss A');
  updatedLog = []
  // displayDuration = this.log.
  relativeDuration = this.log.reduce((acc, cur, idx, src) => {
    // Copy currentEvent
    let event = {...cur};
    // Add the relative Time
    event.relTime = acc;
    this.updatedLog.push(event)
    // calculate the next time
    if (src[idx + 1]) {
      let diff = src[idx + 1].timestamp - cur.timestamp
      if ( diff < MAX_WAIT) {
        return acc += diff;
      } else {
<<<<<<< HEAD
        this.updatedLog.push({
          synthetic: true,
          message: `No activity...skipping ahead to ${moment.unix(src[idx + 1].timestamp/1000).format('MM/DD/YYYY h:mm:ss A')}`,
          relTime: acc += BREAK_DURATION,
        })
        return acc += BREAK_DURATION;
=======
        // THIS INFO WAS HELPFUL FOR DEBUGGIN BUT I THINK WE JUST NEED DURATION
        let newBlock = {
          startTime: this.blockStart.time,
          endTime: moment.unix(cur.timestamp / 1000).format('MM/DD/YYYY h:mm:ss A'),
          duration: cur.timestamp  - this.blockStart.unix,
          startIndex: this.blockStart.logIndex,
          endIndex: idx,
        }
        this.blocks.push(newBlock)
        this.blockStart = {
          unix: src[idx + 1].timestamp,
          time: moment.unix(src[idx + 1].timestamp / 1000).format('MM/DD/YYYY h:mm:ss A'),
          logIndex: idx + 1}
      }
    } else {
      let newBlock = {
        startTime: this.blockStart.time,
        endTime: moment.unix(cur.timestamp /1000).format('MM/DD/YYYY h:mm:ss A'),
        duration: cur.timestamp  - this.blockStart.unix,
        startIndex: this.blockStart.logIndex,
        endIndex: idx,
>>>>>>> removed logging
      }
    } else return acc;
  }, 0)

  componentDidMount() {
<<<<<<< HEAD
    const updatedMembers = [...this.state.currentMembers];
=======
    console.log(this.log)
    console.log(this.blocks)
>>>>>>> removed logging
    if (this.log[0].autogenerated) {
      // DONT NEED TO CHECK IF THEYRE ENTERING OR EXITING, BECAUSE ITS THE FIRST EVENT THEY MUST
      // BE ENTERING
      updatedMembers.push(this.log[0].user);
    }
    this.setState({
      startTime: moment
        .unix(this.log[0].timestamp / 1000)
        .format('MM/DD/YYYY h:mm:ss A'),
      currentMembers: updatedMembers
    })
  }


  componentDidUpdate(prevProps, prevState){
    if (!prevState.playing && this.state.playing && this.state.logIndex < this.updatedLog.length) {
      this.playing();
    }
    else if (!this.state.playing && this.interval){clearInterval(this.interval)}
  }

  playing = () => {
<<<<<<< HEAD
    this.interval = setInterval(() => {
      let timeElapsed = this.state.timeElapsed;
      let logIndex = this.state.logIndex;
      let currentMembers = [...this.state.currentMembers]
      let startTime = this.state.startTime
      let absTimeElapsed = this.state.absTimeElapsed;
      timeElapsed += PLAYBACK_FIDELITY * this.state.playbackSpeed;
      absTimeElapsed += PLAYBACK_FIDELITY * this.state.playbackSpeed;
      const nextEvent = this.updatedLog[this.state.logIndex + 1];
      if (!nextEvent) {
        return this.setState({playing: false})
      }
      if (timeElapsed >= nextEvent.relTime) {
        logIndex++
        if (nextEvent.autogenerated) {
          if (nextEvent.text.includes('joined')) {
           currentMembers.push(nextEvent.user)
          }
          else {currentMembers = currentMembers.filter(user => user._id !== nextEvent.user._id)}
        }
        if (this.updatedLog[this.state.logIndex].synthetic) {
          startTime = moment(nextEvent.timestamp).format('MM/DD/YYYY h:mm:ss A');
          absTimeElapsed = 0;
=======
    const currentEvent = this.log[this.state.logIndex];
    const nextEvent = this.log[this.state.logIndex + 1];
    // console.log(nextEvent)
    const eventDuration = nextEvent.timestamp - currentEvent.timestamp;
    let updatedMembers = [...this.state.currentMembers];
    this.timer = setTimeout(() => {
      if (currentEvent.autogenerated) { // if this event is a message from VMTbot
        if (currentEvent.text.includes('joined')) {
          updatedMembers.push(currentEvent.user)
>>>>>>> removed logging
        }
      }
      this.setState(prevState => ({
        logIndex, timeElapsed, currentMembers,
        startTime, absTimeElapsed,
      }))
    }, PLAYBACK_FIDELITY)
  }


  goToTime = (percent) => {
    let logIndex;
    let timeElapsed = percent  * this.relativeDuration
    if (percent === 1) {
      logIndex = this.updatedLog.length - 1;
      timeElapsed = this.relativeDuration
    }
    else {
      this.updatedLog.some((entry, i) => {
        if (entry.relTime > timeElapsed) {
          logIndex = i === 0 ? 0 : i - 1;
          return true;
        } return false;
      })
    }
    this.setState({timeElapsed, logIndex, playing: false, changingIndex: true,})
    // setTimeout(() => this.setState({playing:}))
  }

  pausePlay = () => {
    this.setState(prevState => ({
      playing: !prevState.playing
    }))
  }

  reset = () => {
    this.setState({changingIndex: false})
  }

  setCurrentMembers = (currentMembers) => {
    this.setState({currentMembers,})
  }

  setSpeed = speed => {
    this.setState({playbackSpeed: speed})
  }

  render() {
<<<<<<< HEAD
    const { room } = this.props
    const event = this.log[this.state.logIndex] || {};
=======
    // console.log(this.log.map(entry => moment.unix(entry.timestamp/1000).format('MM/DD/YYYY h:mm:ss A')))
    const { room } = this.props
    const event = this.log[this.state.logIndex];
>>>>>>> removed logging
    return (
      <WorkspaceLayout
        activeMember = {event.user}
        members = {this.state.currentMembers}
        graph = {room.roomType === 'geogebra' ?
          // I dont like that these 👇 need to be wrapped in functions could do
          // props.children but I like naming them. Wait is this dumb? we could just pass
          // event to workspaceLayout and then import the graphs there...I did kind of like
          // that a container is importing the containers....I dunno
          () => <GgbReplayer
            log={this.updatedLog}
            index={this.state.logIndex}
            skipping={this.state.changingIndex}
            reset={this.reset} />
        :
        () => <DesmosReplayer
          log={this.updatedLog}
          index={this.state.logIndex}
          skipping={this.state.changingIndex}
          reset={this.reset} />}

        chat = {() =>
          <ChatReplayer
            log={this.updatedLog}
            index={this.state.logIndex}
            skipping={this.state.changingIndex}
            reset={this.reset}
            setCurrentMembers={this.setCurrentMembers}
          />}
        // chat={() => <div>chat</div>}
        replayer={() =>
          (<ReplayControls
            playing={this.state.playing}
            pausePlay={this.pausePlay}
            duration={this.relativeDuration}
            startTime={this.state.startTime}
            absTimeElapsed={this.state.absTimeElapsed}
            goToTime={this.goToTime}
            speed={this.state.playbackSpeed}
            setSpeed={this.setSpeed}
            relTime={this.state.timeElapsed}
            index={this.state.logIndex}
            log={this.updatedLog}
            endTime={this.endTime}
           />)
        }
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    room: state.rooms.byId[ownProps.match.params.room_id],
    user: state.user,
    loading: state.loading.loading,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateRoom: (roomId, body) => dispatch(actions.updateRoom(roomId, body)),
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Replayer);
