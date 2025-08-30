import { useEffect, useState, useMemo, useRef } from "react";
import CarIcon from "./CarIcon";
import obstacles from "./obstacles"
import records from "./records";
import {wait} from "./utils";
import { advanceCoord, getNextCoordIndex } from "./movement";

const gridSize = 500;
const gridCount = 50;
const squareSize = gridSize / gridCount;


const fetchInterval = 1000;
const refreshInterval = 33;

const coordsToObstacles = [];
obstacles.forEach(([xStart, xEnd, yStart, yEnd, color]) => {
  let x = xStart;
  while(x <= xEnd){
    let y = yStart;
    while(y <= yEnd){
      coordsToObstacles[`${x}:${y}`] = color || '#d77a61';
      y += 1;
    }
    x += 1;
  }
});

  const Obstacle = ({type, x, y, color}) => (
    <rect
      width={squareSize}
      height={squareSize}
      x={x}
      y={y}
      fill={color}
      stroke={color}
    />
  )


const Car = ({next, rotation, path}) => {
    
    const [position, setPosition] = useState(next)
    const prevNextRef = useRef(next);
    
    useEffect(() => {
    if(prevNextRef.current === next) return;
    prevNextRef.current = next;

    move(next);
  }, [next, path])

    async function move(nextCoord) {
      
      let [currX, currY] = position
      const startIndex = getNextCoordIndex(currX, currY, path)
      const endIndex = path.findIndex(([x, y]) => (
        x === nextCoord[0] && y === nextCoord[1]
      ))

      const section = path.slice(startIndex, endIndex + 1)
      const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1)
      const steps = fetchInterval / refreshInterval
      const increment = distance / steps

      for(let i=0; i<section.length; i++){
        const [nextX, nextY] = section[i]

        while(currX !== nextX){
          if(nextCoord !== next) return
          currX = advanceCoord(currX, nextX, increment)
          setPosition(([_, y]) => [currX, y])
          await wait(refreshInterval)
        }
         while(currY !== nextY){
          if(nextCoord !== next) return
          currY = advanceCoord(currY, nextY, increment)
          setPosition(([x, _]) => [x, currY])
          await wait(refreshInterval)
        }
    }
  }

    const [x, y] = position;
    
    return (
    <CarIcon
      x = {x * squareSize - 20}
      y = {y * squareSize - 20}
      rotation={rotation}
    />
    )
}


const Map = () => {
  const [cars, setCars] = useState([]);

  async function simulate() {
    for (const record of records) {
      setCars([record]);
      console.log(record);
      await wait(fetchInterval);
    }
  }

  useEffect(() => {
    simulate()
  }, [])

  const obstacleElems = useMemo(() => {
        const elems = [];
        for(let [key, color] of Object.entries(coordsToObstacles)){
        const [x, y] = key.split(':');
        elems.push(
          <Obstacle
            key={`${x}:${y}`}
            x = {x * squareSize}
            y = {y * squareSize}
            color={color}
            />
        );
      }
    return elems;
     
  }, []);

  return (
    <svg
      width={gridSize}
      height={gridSize}
      className="map"
    >
      {obstacleElems}
      {cars.map(({id, next, rotation, path})=>(
     <Car key={id} next={next} rotation={rotation || 0} path={path} />
  ))}
    </svg>
  )
}


function App() {

  return (
    <div className='App'>
      <Map />
    </div>
  )
}

export default App
