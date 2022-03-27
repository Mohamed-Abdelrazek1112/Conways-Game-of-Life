import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 10;
const numCols = 10;
const accessindexes = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];


//function useState(){};

function gengrid(){
  const rows = [];
  for(let i=0;i<numRows;i++){
    //console.log(rows);
    rows.push(Array.from(Array(numCols),() => 0))
  }
  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return gengrid();
  });
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if(!runningRef.current){
      return;
    }  
    // simulate
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            accessindexes.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });


    setTimeout(runSimulation,100);

  },[])

  return (
    <>
    <button
      onClick={() => {
        setRunning(!running);
        if(!running){
          runningRef.current = true;
          runSimulation();
        }
      }}
    >{running ? 'stop' : 'start'}</button>
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${numCols},40px)`
    }}>{
      grid.map((rows,i) => 
        rows.map((col,k) => (<div key={`${i}-${k}`} 
        onClick={() =>{
          console.log("CLICK",i,k);
          const newGrid = produce(grid, gridCopy => {
          gridCopy[i][k] = grid[i][k] ? 0 : 1;
          });
        setGrid(newGrid);
        }}
        style={
          {width:40,
            height:40,
            backgroundColor: grid[i][k]?"pink":undefined,
            border: "solid 1px black"}}></div>
        )))
    }
      
      </div>
  </>
  );}

export default App;
