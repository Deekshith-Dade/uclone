const nodes = {'0:0':{}};

const main = async () => {
  const visited = {};

  const highlightVisited = async (coords) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1);
    });
    const rect = points[coords];
    rect.setAttribute('fill', '#b0b0b0');

  };

  const build = async ({x, y}) => {
    visited[`${x}:${y}`] = true
    const currentNode = nodes[`${x}:${y}`]

    await highlightVisited(`${x}:${y}`);

    const neighbours = [
      [x, y-1],
      [x+1, y],
      [x, y+1],
      [x-1, y],
    ];


    for(const [x, y] of neighbours){
      const coords = `${x}:${y}`;
      if(points[coords]) {
        nodes[coords] = nodes[coords] || {};
        currentNode[coords] = nodes[coords];
        if(!visited[coords]) await build({x, y});
      }
    }

  };


  const bfs = async ({x, y}) => {
     var queue = [];
      queue.push([x,y]);  

    var key = `${x}:${y}`
    highlightVisited(key);
    visited[key] = true;
    var drow = [1, 0, -1, 0];
    var dcol = [0, -1, 0, 1];
    
    while(queue.length > 0){
      const [cx, cy] = queue.shift();
      const currentNode = nodes[`${cx}:${cy}`];

      for(let i=0; i<4; i++){
          var nx = cx + drow[i];
          var ny = cy + dcol[i];
          
        key = `${nx}:${ny}`
        if(points[key]){
          nodes[key] = nodes[key] || {};
          currentNode[key] = nodes[key];
          if(!visited[key]){
            queue.push([nx, ny]);
            visited[key] = true;
            await highlightVisited(key);
          }
          
        }
      }

    }
  }

  await bfs({x: 0, y: 0});
}

main();
