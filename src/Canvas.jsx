import React, {useRef, useEffect, useState} from 'react';

const Canvas = props => {
  const cwidth = props.cwidth
  const cheight = props.cheight
  const rectSize = props.rectSize
  const colors = props.colors
  const [prevGrid, setPrevGrid] = useState(0)
  const canvasRef = useRef(null)
  const gridData = props.gridData
  useEffect(() => {

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    for (let i = 0; i < gridData.length; i += 1) {
      if (!prevGrid || prevGrid[i] !== gridData[i]) {
        if (gridData[i] === 1) {
          ctx.fillStyle = colors.red
        } else 
        if (gridData[i] === 2) {
          ctx.fillStyle = colors.white
        } else 
        if (gridData[i] === 3) {
          ctx.fillStyle = colors.blue
        } else {
          ctx.fillStyle = "#000000"
        }
        ctx.fillRect(rectSize * (i % cwidth),rectSize* Math.floor(i/cwidth), rectSize , rectSize);
      }
    }
    setPrevGrid(gridData)

    
  },[gridData,prevGrid,cwidth,cheight,rectSize,colors])
  if (props.gameState === 1) {
    return (<canvas ref={canvasRef} id="flag" width={cwidth * rectSize} height={cheight * rectSize}  onMouseDown={props.mouseDown}  onTouchStart={props.mouseDown} onMouseUp={props.mouseUp} onTouchMove={props.mouseMove} onMouseMove={props.mouseMove}></canvas>)
  } else {
  return (<canvas ref={canvasRef} id="endscreenflag" width={cwidth * rectSize} height={cheight * rectSize} ></canvas>)

  }
}


export default Canvas;
