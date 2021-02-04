import React, {useRef, useState, useEffect} from 'react';

const TimerBar = props => {

  const [lastAnimated,setLastAnimated]  = useState(0)


  const useAnimationFrame = callback => {
    const requestRef = useRef();
    const previousTimeRef = useRef();
    
    useEffect(() => {
      const animate = time => {
        if (previousTimeRef.current !== undefined) {
          const deltaTime = time - previousTimeRef.current;
          callback(deltaTime)
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
      }
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }, [callback]); 
  }

  useAnimationFrame(deltaTime => {
    if (Date.now()-lastAnimated > 1000/33) {
      props.updateCanvas()
      setLastAnimated(Date.now())
    }
  })

  return (<div id="timer">
  <div id="timerbar" style={{width: 100 * (Date.now()-props.startTime)/props.timerLength + "%"}}></div>
  </div>)
}

export default TimerBar;
