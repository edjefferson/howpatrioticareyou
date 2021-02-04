import React, { useRef, useEffect, useState } from 'react';
import Canvas from './Canvas';
import TimerBar from './TimerBar';


const Game = () => {




  const cheight = 30
  const cwidth = 50
  const rectSize = 200


  const targetCanvasRef = useRef(null)


  const colors = {
    red: "#cf142b",
    white: "#ffffff",
    blue: "#00247d"
  }

 

  const updateCanvas = () => {

    if (gameState === 1 && Date.now()-startTime < timerLength) {
      //
    } else
    if (gameState === 1) {

      setGameState(2)
    }
  }

  const initialGrid = () => {
    let grid = []
  
    for (let step = 0; step < cheight*cwidth; step++) {
      grid.push(2)
    }
    return grid
  }

  const [gridData, setGridData] = useState(initialGrid());
  const [canvasGridData, setCanvasGridData] = useState(initialGrid());
  const [selectedColor, setSelectedColor] = useState(1);
  const [targetFlag, setTargetFlag] = useState(0)
  const [lastTouch,setLastTouch] = useState(0)
  const [gameState,setGameState] = useState(0)
  const [startTime,setStartTime] = useState(0)

  const timerLength = 60000


  useEffect(() => {
    setCanvasGridData(() =>{ return gridData})

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
        img.src = 'perfectflag.png';


        //setTargetFlag([])
      }
    }
  },[targetFlag,gameState, gridData])

  const mouseDown = (e) => {
    let newXValue = Math.floor(cwidth*(e.clientX-e.target.offsetLeft)/e.target.clientWidth)
    let newYValue = Math.floor(cheight*(e.clientY-e.target.offsetTop)/e.target.clientHeight)
    setGridData(gridData => {
      let newGridData = [...gridData]
      if (newYValue >= 0 && newXValue >= 0 && newYValue < cwidth && newXValue < cheight){
        newGridData[newYValue * cwidth +newXValue] = selectedColor
      }
      return newGridData
    })

  }
  const compareFlags = () => {
    let correctPixels = 0

    canvasGridData.forEach( (d,i) => {
      if (d === targetFlag[i]) {
        correctPixels += 1
      }
    })
    return (correctPixels/canvasGridData.length)
  }
 

  const bline = (x0, y0, x1, y1) => {
    let linePoints = []
    let dx = Math.abs(x1 - x0),
    sx = x0 < x1 ? 1 : -1;
    let dy = Math.abs(y1 - y0),
    sy = y0 < y1 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;
    while (true) {
        linePoints.push([Math.floor(x0), Math.floor(y0)]);
        if (Math.abs(x0-x1) < 1 && Math.abs(y0-y1) < 1) break
        

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

  const handleMovement = (e) => {
    let newXValue = cwidth*(e.clientX-e.target.offsetLeft)/e.target.clientWidth
    let newYValue = cheight*(e.clientY-e.target.offsetTop)/e.target.clientHeight
    let oldXValue = lastTouch ? lastTouch[0] : newXValue
    let oldYValue = lastTouch ? lastTouch[1] : newYValue

    setGridData(gridData => {
      let newGridData = [...gridData]
      let line = bline(oldXValue,oldYValue,newXValue,newYValue)
      line.forEach(c => {
        if (c[1] >= 0 && c[0] >= 0 && c[1] < cheight && c[0] < cwidth){
          newGridData[c[1] * cwidth +c[0]] = selectedColor
        }
      })
      return newGridData
    })
    setLastTouch([newXValue,newYValue])
  }

  const mouseMove = (e) => {
    if (e.buttons) {
      
      handleMovement(e)
    } else
    if (e.touches) {
      Array.from(e.touches).forEach(t => {
        handleMovement(e)
      })
    } 
  }
  const mouseUp = (e) => {
    setLastTouch(0)
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
        <Canvas gameState={gameState} colors={colors} gridData={canvasGridData} mouseUp={mouseUp} mouseDown={mouseDown} mouseMove={mouseMove} rectSize={rectSize} cheight={cheight} cwidth={cwidth}/>
      <div className="buttons">
        {[colors.red,colors.white,colors.blue].map ((x,i) => {return (
      <div key={i} className={ i + 1 === selectedColor ? "colorbutton selectedcolor" : "colorbutton"} onClick={colorSelect} id={(i+ 1).toString()}  style={{ backgroundColor: x}}></div>
            )})   }
        </div>
    <TimerBar updateCanvas={updateCanvas} startTime={startTime} timerLength={timerLength}/>
     

  <canvas id="flagcheck" width="500" height="300" ref={targetCanvasRef} >dd</canvas>
      </>
      )
    } else
    if (gameState === 2) {
      return (
        <div id="instructions">
          <div id="scoretext"><div>Thankyou for paying respect!</div>
          <Canvas gameState={gameState} colors={colors} gridData={canvasGridData} rectSize={rectSize} cheight={cheight} cwidth={cwidth}/>

            <div>You have scored {Math.round(1000*compareFlags())/10 + "% patriotisms!"}</div>
          </div>
        </div>
      )
    } else {
      return (
      <div id="instructions">
        <div id="introtext">Please demonstrate respect for your country by correctly drawing flag.</div>
        <div id="startgame" onClick={startDraw}><div id="starttext">Click To Pay Respect</div></div>
      </div>
      )
    }
  }

  return (

  <>
  <h1>HOW PATRIOTIC ARE YOU?</h1>
  <h2>[UK EDITION]</h2>
  {stateDisplay()}
    
   </>
  )
}


export default Game;
