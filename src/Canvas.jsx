import React, {useRef, useState, useEffect} from 'react';

const Canvas = props => {
  const instructions = props.instructions
  const cwidth = props.cwidth
  const cheight = props.cheight
  const rectSize = props.rectSize
  const colors = props.colors
  const canvasRef = useRef(null)
  const [touch,setTouch] = useState(0)
  const [lastTouch,setLastTouch] = useState(0)
  const currentColor = 1

  const bline = (x0, y0, x1, y1) => {
      let linePoints = []
      let dx = Math.abs(x1 - x0),
      sx = x0 < x1 ? 1 : -1;
      let dy = Math.abs(y1 - y0),
      sy = y0 < y1 ? 1 : -1;
      let err = (dx > dy ? dx : -dy) / 2;
      let s = 0
      while (x0 && y0 && s < 99) {
          s += 1
          linePoints.push([Math.floor(x0),Math.floor(y0)]);
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

  const getCoordinates = (e) => {
    let bounds = e.target.getBoundingClientRect()
    if (e.touches) {
      return [
        cwidth*(e.touches[0].clientX-bounds.x)/e.target.clientWidth,
        cheight*(e.touches[0].clientY-bounds.y)/e.target.clientHeight
      ] 
    } else {
      return [
        cwidth*(e.clientX-bounds.x)/e.target.clientWidth,
        cheight*(e.clientY-bounds.y)/e.target.clientHeight
      ] 
    }
  };
  
  const drawRect = (coords) => {

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (currentColor === 1) {
      ctx.fillStyle = colors.red
    } else 
    if (currentColor === 2) {
      ctx.fillStyle = colors.white
    } else 
    if (currentColor === 3) {
      ctx.fillStyle = colors.blue
    } else {
      ctx.fillStyle = "#000000"
    }
    ctx.fillRect(rectSize * Math.floor(coords[0]),rectSize*Math.floor(coords[1]), rectSize , rectSize);
}

  const mouseDown = (e) => {
    if (!touch) {
      let coords = getCoordinates(e)
      setLastTouch(coords)
      drawRect(coords)
    }
  }

  const mouseMove = (e) => {
    if (!touch && lastTouch) {
      drawRect(e)
      let coords = getCoordinates(e)
      let line = bline(lastTouch[0],lastTouch[1],coords[0],coords[1])
      line.forEach(c => {
        drawRect(c)
      })
      setLastTouch(coords)
    }
  }

  const mouseUp = (e) => {
    if (!touch){
     setLastTouch(0)
    }
  }

  const touchStart= (e) => {
    let coords = getCoordinates(e)
      setLastTouch(coords)
      drawRect(coords)
  }
 
  const touchMove = (e) => {
    console.log("tm")
    if (lastTouch) {
      drawRect(e)
      let coords = getCoordinates(e)
      let line = bline(lastTouch[0],lastTouch[1],coords[0],coords[1])
      line.forEach(c => {
        drawRect(c)
      })
      setLastTouch(coords)
    }
  }
 
  const touchEnd = (e) => {
    //if (!touch) setTouch(1)
  }

  
  if (props.gameState === 1) {
    return (<canvas ref={canvasRef} id="flag" width={cwidth * rectSize} height={cheight * rectSize}  onMouseDown={mouseDown}  onTouchStart={touchStart} onMouseUp={mouseUp} onTouchMove={touchMove} onTouchEnd={touchEnd} onMouseMove={mouseMove}></canvas>)
  } else {
  return (<canvas ref={canvasRef} id="endscreenflag" width={cwidth * rectSize} height={cheight * rectSize} ></canvas>)

  }
}


export default Canvas;
