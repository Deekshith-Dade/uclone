import { useState, useRef, useEffect } from "react";
import CarIcon from "./CarIcon";
import { wait } from "./utils";
import { advanceCoord, countTurns, getNextCoordIndex, getRotation, getTurnDistance } from "./movement";

import config from "./config";
const {
  squareSize,
  fetchInterval,
  refreshInterval,
  turnDuration,
} = config;


const Car = ({next, path}) => {
    
    const [position, setPosition] = useState(next)
    const [rotateBusy, setRotateBusy] = useState(false)
    const [rotation, setRotation] = useState(getRotation(path, 1))
    const prevNextRef = useRef(next);
    const rotationRef = useRef(rotation);

    useEffect(() => {
      rotationRef.current = rotation;
  }, [rotation])
    
    useEffect(() => {
    if(prevNextRef.current === next) return;
    prevNextRef.current = next;

    move(next);
  }, [next, path])

    async function rotate(section, i){
    setRotateBusy(true);

    let currRotation = rotationRef.current;
    const targetRotation = getRotation(section, i);
    console.log(`TargetRotation: ${targetRotation}`)
    if(currRotation === targetRotation) {
      setRotateBusy(false);
      return;
    }

    const {distClockwise, distCounterclockwise} = getTurnDistance(currRotation, targetRotation);
    const isClockwise = distClockwise < distCounterclockwise;

    const diff = Math.min(distClockwise, distCounterclockwise);
    const steps = turnDuration / refreshInterval;
    const increment = diff / steps;
    console.log(`Increment ${increment}, turnDuration: ${turnDuration}, refreshInterval ${refreshInterval}, diff: ${diff}`)
    while(currRotation != targetRotation){
      if(isClockwise) currRotation += increment;
      else currRotation -= increment;

      if(currRotation > 360) currRotation=0;
      else if(currRotation < 0) currRotation = 360 - Math.abs(currRotation);

      setRotation(currRotation);
      await wait(refreshInterval);
      
    }
    
    setRotation(targetRotation)
    rotationRef.current = targetRotation;
    setRotateBusy(false);
   }

    async function move(nextCoord) {
      
      let [currX, currY] = position
      const startIndex = getNextCoordIndex(currX, currY, path)
      const endIndex = path.findIndex(([x, y]) => (
        x === nextCoord[0] && y === nextCoord[1]
      ))

      const section = path.slice(startIndex, endIndex + 1)
      const turnCount = countTurns(section);
      const turnsDuration = turnCount * turnDuration;
      
      const distance = endIndex - startIndex + Math.max(currX % 1, currY % 1)
      const steps = (fetchInterval - turnsDuration) / refreshInterval
      const increment = distance / steps

      for(let i=0; i<section.length; i++){
        if(i > 0) {
        while(rotateBusy) {
          await wait(refreshInterval);
        }
        await rotate(section, i)
      }
        
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

export default Car;
