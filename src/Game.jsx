import React, { useRef, useEffect, useState } from 'react';
import Canvas from './Canvas';
import TimerBar from './TimerBar';
import flag from './perfectflag.png'
import { TwitterShareButton } from "react-share";
const Game = () => {




  const cheight = 30
  const cwidth = 50
  const rectSize = 10


  const targetCanvasRef = useRef(null)


  const colors = {
    red: "#cf142b",
    white: "#ffffff",
    blue: "#00247d"
  }

 

  const updateCanvas = () => {

    if (gameState === 1 && Date.now()-startTime < timerLength) {
      //setCanvasGridData(() =>{ return gridData})
    } else
    if (gameState === 1) {

      setGameState(2)
    }
  }
  const tryAgain = () => {
    setGridData(initialGrid())

    setGameState(0)
  }

  const initialGrid = () => {
    let grid = []
  
    for (let step = 0; step < cheight*cwidth; step++) {
      grid.push(2)
    }
    return grid
  }

  const [gridData, setGridData] = useState(initialGrid());
  const [selectedColor, setSelectedColor] = useState(1);
  const [targetFlag, setTargetFlag] = useState(0)
  const [lastTouch,setLastTouch] = useState(0)
  const [gameState,setGameState] = useState(0)
  const [startTime,setStartTime] = useState(0)

  const timerLength = 10000


  useEffect(() => {

    if (gameState === 1) {
      const rgbcolors = {
        red: [255, 0, 0, 255],
        white: [255, 255, 255,255],
        blue: [0, 0, 255, 255]
      }
      if (!targetFlag) {
        const targetFlagData = []
        const canvas = targetCanvasRef.current
        const ctx2 = canvas.getContext('2d')
        canvas.width  = cwidth * 10;
        canvas.height = cheight * 10;
        var img = new Image();
        img.onload = () => {
          console.log("comparison image load")
          ctx2.drawImage(img, 0, 0);

          for (let step = 0; step < cheight*cwidth; step++) {

            let x = step % cwidth
            let y = Math.floor(step / cwidth)

            let pixelData = Array.from(ctx2.getImageData(5 + x * 10 , 5 + y * 10, 1, 1).data)
          
            if (JSON.stringify(pixelData) === JSON.stringify(rgbcolors.red)) {

              targetFlagData.push(1)
            } else
            if (JSON.stringify(pixelData) === JSON.stringify(rgbcolors.white)) {
              targetFlagData.push(2)
            } else 
            if (JSON.stringify(pixelData) === JSON.stringify(rgbcolors.blue)) {
              targetFlagData.push(3)
            } else {
              targetFlagData.push(0)
            }
          }

          setTargetFlag(targetFlagData)

        }
        img.onerror = () => {
          console.log("image loaderror")
        }
        img.src = flag;


        //setTargetFlag([])
      }
    }
  },[targetFlag,gameState, gridData])

  
  const mouseDown = (e) => {
    let bounds = e.target.getBoundingClientRect()

    let newXValue = Math.floor(cwidth*(e.clientX-bounds.x)/e.target.clientWidth)
    let newYValue = Math.floor(cheight*(e.clientY-bounds.y)/e.target.clientHeight)
    console.log([newXValue,newYValue])


    setGridData(gridData => {
      let newGridData = [...gridData]
      if (newYValue >= 0 && newXValue >= 0 && newXValue < cwidth && newYValue < cheight){
        newGridData[newYValue * cwidth +newXValue] = selectedColor
      }
      return newGridData
    })
    setLastTouch([newXValue,newYValue])

  }
  const compareFlags = () => {
    let correctPixels = 0

    gridData.forEach( (d,i) => {
      if (d === targetFlag[i]) {
        correctPixels += 1
      }
    })

    let score = 8.7214 *Math.log(correctPixels/gridData.length) + 11.38
    if (score > 10) {
      score = 10
    } else
    if (score < 0) {
      score = 0
    }

    return (score)
  }
 

  const bline = (x0, y0, x1, y1) => {
    let linePoints = []
    let dx = Math.abs(x1 - x0),
    sx = x0 < x1 ? 1 : -1;
    let dy = Math.abs(y1 - y0),
    sy = y0 < y1 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;
    while (x0 && y0) {

        linePoints.push([x0,y0]);
        if ((Math.abs(x0-x1) < 1 && Math.abs(y0-y1) < 1)) break
        

        let e2 = err;
        if (e2 > -dx) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dy) {
            err += dx;
            y0 += sy;
        }
    }
    return(linePoints)
}

  const handleMovement = (e, lastTouch) => {

    let bounds = e.target.getBoundingClientRect()

    let newXValue = Math.floor(cwidth*(e.clientX-bounds.x)/e.target.clientWidth)
    let newYValue = Math.floor(cheight*(e.clientY-bounds.y)/e.target.clientHeight)
    let line
    if (lastTouch && lastTouch[0] && !(lastTouch[0] === newXValue && lastTouch[1] === newYValue)) {
      let oldXValue = lastTouch[0]
      let oldYValue = lastTouch[1]
      console.log(oldXValue,oldYValue,newXValue,newYValue)
      line = bline(oldXValue,oldYValue,newXValue,newYValue)
      setGridData(gridData => {
        let newGridData = [...gridData]
        line.forEach(c => {
          if (c[1] >= 0 && c[0] >= 0 && c[1] < cheight && c[0] < cwidth){
            newGridData[c[1] * cwidth +c[0]] = selectedColor
          }
        })
        return newGridData
      })
    } else if (!lastTouch || !lastTouch[0]){
      line = [[newXValue,newYValue]]
      setGridData(gridData => {
        let newGridData = [...gridData]
        line.forEach(c => {
          if (c[1] >= 0 && c[0] >= 0 && c[1] < cheight && c[0] < cwidth){
            console.log(c[0],c[1])
            newGridData[c[1] * cwidth +c[0]] = selectedColor
          }
        })
        return newGridData
      })
     
    }
    return [newXValue,newYValue]
  }

  const mouseMove = (e) => {
    if (e.buttons) {
      setLastTouch(handleMovement(e,lastTouch))
    } else
    if (e.touches) {
      console.log(e)
      setLastTouch(handleMovement(e.touches[0],lastTouch))
    } 
  }
  const mouseUp = (e) => {
    //setLastTouch(0)
  }

  const colorSelect = (e) => {
    setSelectedColor(parseInt(e.target.id))
  }

  const startDraw = () => {
    setGameState(1)

    setStartTime(Date.now())
  }
  

  const stateDisplay = () => {
    if (gameState === 1) {
      return (
        <>
        <Canvas gameState={gameState} colors={colors} gridData={gridData} mouseUp={mouseUp} mouseDown={mouseDown} mouseMove={mouseMove} rectSize={rectSize} cheight={cheight} cwidth={cwidth}/>
      <div className="buttons">
        {[colors.red,colors.white,colors.blue].map ((x,i) => {return (
      <div key={i} className={ i + 1 === selectedColor ? "colorbutton selectedcolor" : "colorbutton"} onClick={colorSelect} id={(i+ 1).toString()}  style={{ backgroundColor: x}}></div>
            )})   }
        </div>
     

  <canvas id="flagcheck" width="500" height="300" ref={targetCanvasRef} >dd</canvas>
      </>
      )
    } else
    if (gameState === 2) {
      return (
        <div id="instructions">
          <div id="scoretext"><div>Thankyou for paying respect!</div>
          <Canvas gameState={gameState} colors={colors} gridData={gridData} rectSize={rectSize} cheight={cheight} cwidth={cwidth}/>

            <div>You have scored {Math.round(10*compareFlags())/10 + " patriotisms out of 10!"}</div>
            <div className="endButtons"><div onClick={tryAgain} className="endbutton">Try Again</div><div className="endbutton">
              
            <TwitterShareButton url="https://edjefferson.com/howpatrioticareyou" title={"My drawing of a flag scored "+ Math.round(10*compareFlags())/10 +" patriotisms out of 10!"}>Tweet</TwitterShareButton>
              </div></div>
          </div>
        </div>
      )
    } else {
      return (
      <div id="instructions">
        <div id="introtext">Please demonstrate respect for your country by correctly drawing flag</div>
        <div id="startgame" onClick={startDraw}><div id="starttext">Click To Pay Respect</div></div>
      </div>
      )
    }
  }

  return (

  <>

  {stateDisplay()}
  <TimerBar gameState={gameState} updateCanvas={updateCanvas} startTime={startTime} timerLength={timerLength}/>

   </>
  )
}


export default Game;
