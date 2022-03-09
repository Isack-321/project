import React, { Component} from "react";
import Countdown from 'react-countdown';
class Timer extends Component{
    constructor(props) {
        super(props)
    
        this.state = {
          
        }
}
    render(){
        return (
        <div className="timer">
            <span>Election started. <br/>Remaining time is:</span>
            <Countdown date={Date.now()+ 1000000}/>
        </div>);
    }
}
    export default Timer;