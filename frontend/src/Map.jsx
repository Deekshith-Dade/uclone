import { useState, useEffect, useMemo } from "react";
import Car from "./Car";
import obstacles from "./obstacles";
import records from "./records";
import { wait } from "./utils";

import config from "./config";
const {
  gridSize,
  squareSize,
  fetchInterval,
} = config;


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

  const Obstacle = ({x, y, color}) => ( <rect
      width={squareSize}
      height={squareSize}
      x={x}
      y={y}
      fill={color}
      stroke={color}
    />
  )



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

export default Map;
