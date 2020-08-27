import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faHistory,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import moment from "moment";
const NOW = new Date();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      timeLeft: "25:00",
      isTimerOn: false,
      isBreak: false,
      isSession: true,
    };
    this.formatMin = this.formatMin.bind(this);
    this.handleBreak = this.handleBreak.bind(this);
    this.handleSession = this.handleSession.bind(this);
    this.clear = this.clear.bind(this);
    this.playPauseTimer = this.playPauseTimer.bind(this);
    this.incrementTimer = this.incrementTimer.bind(this);
  }
  componentDidMount() {
    this.formatMin("session");
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  incrementTimer(timer) {
    const INTERVAL = 1000;
    var temp1 = document.getElementById("beep");
    if (timer === "00:00" && this.state.isBreak) {
      clearInterval(this.interval);
      this.formatMin("session");
      temp1.play();
      this.setState({
        isSession: true,
        isBreak: false,
      });
    } else if (
      timer === "00:00" &&
      this.state.isSession &&
      this.state.isTimerOn
    ) {
      clearInterval(this.interval);
      this.formatMin("break");
      temp1.play();
      console.log("after format", this.state);
      this.setState(
        {
          isBreak: true,
          isSession: false,
        },
        () => {
          this.interval = setInterval(
            () => this.incrementTimer(this.state.timeLeft),
            INTERVAL
          );
        }
      );
    } else if (
      timer !== "00:00" &&
      (this.state.isSession || this.state.isBreak) &&
      this.state.isTimerOn
    ) {
      NOW.setMinutes(timer.substr(0, timer.indexOf(":")));
      NOW.setSeconds(timer.substr(timer.indexOf(":") + 1));
      // console.log("now min", now.getMinutes());
      // console.log("now sec", now.getSeconds());
      const temp = moment
        .utc(
          moment.duration(NOW.getMinutes() * 60 + NOW.getSeconds(), "seconds") -
            1
        )
        .format("mm:ss");
      this.setState(
        {
          timeLeft: temp,
        },
        () => console.log("after update timer", this.state)
      );
    }
  }
  formatMin(indicator) {
    var tempTime;
    if (indicator === "session") {
      tempTime = this.state.session;
    } else if (indicator === "break") {
      tempTime = this.state.break;
      console.log("format min tempTime", tempTime);
    }
    const durationTemp = moment
      .utc(moment.duration(tempTime * 60, "seconds").asMilliseconds())
      .format("mm:ss");
    console.log("break after parse", durationTemp);
    // const formatted = durationTemp && durationTemp.format("mm:ss");
    this.setState({
      timeLeft: durationTemp,
    });
  }
  handleBreak(op) {
    if (op === "in" && this.state.break < 60) {
      this.setState((state) => ({
        break: state.break + 1,
      }));
    } else if (op === "de" && this.state.break > 1) {
      this.setState((state) => ({
        break: state.break - 1,
      }));
    }
    console.log("break", this.state);
  }
  handleSession(op) {
    if (op === "in" && this.state.session < 60) {
      this.setState(
        (state) => ({
          session: state.session + 1,
        }),
        () => this.formatMin("session")
      );
    } else if (op === "de" && this.state.session > 1) {
      this.setState(
        (state) => ({
          session: state.session - 1,
        }),
        () => this.formatMin("session")
      );
    }
    console.log("session", this.state);
  }
  clear() {
    this.setState((state) => ({
      break: 5,
      session: 25,
      isTimerOn: false,
      isBreak: false,
      isSession: true,
    }));
    var temp2 = document.getElementById("beep");
    temp2.pause();
    temp2.currentTime = 0;
  }
  playPauseTimer() {
    const INTERVAL = 1000;

    this.setState(
      (state) => ({
        isTimerOn: !state.isTimerOn,
      }),
      () => {
        // clearInterval(this.interval);
        if (this.state.isTimerOn && this.state.isSession) {
          this.interval = setInterval(
            () => this.incrementTimer(this.state.timeLeft),
            INTERVAL
          );
          if (this.state.timeLeft === "00:00") {
            clearInterval(this.interval);
          }
        }
      }
    );
  }
  render() {
    return (
      <>
        <div className="row col-12">
          <div className="col-3"></div>
          <div className="col-3" id="break-label">
            Break Length <br />
            <button id="break-decrement" onClick={() => this.handleBreak("de")}>
              {" "}
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <span id="break-length">{this.state.break}</span>
            <button id="break-increment" onClick={() => this.handleBreak("in")}>
              {" "}
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>
          <div className="col-3" id="session-label">
            Session Length
            <br />
            <button
              id="session-decrement"
              onClick={() => this.handleSession("de")}
            >
              {" "}
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <span id="session-length">{this.state.session}</span>
            <button
              id="session-increment"
              onClick={() => this.handleSession("in")}
            >
              {" "}
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>
        </div>
        <div className="row col-12">
          <div className="col-3"></div>
          <div className="col-1"></div>
          <div className="col-2 border rounded text-center">
            <div id="timer-label">
              {this.state.isSession ? "Session" : "Break"}
            </div>
            <div id="time-left">{this.state.timeLeft}</div>
            <button id="start_stop" onClick={() => this.playPauseTimer()}>
              <FontAwesomeIcon icon={faPlayCircle} />
            </button>
            <button id="reset" onClick={() => this.clear()}>
              <FontAwesomeIcon icon={faHistory} />
            </button>
          </div>
          <audio
            id="beep"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
      </>
    );
  }
}

export default App;
