//FINAL VERSION
var cols = 21;
var rows = 21;
var len = 600;
var wid = 600;
var startx = 0;
var starty = 0;
var endx = cols -1;
var endy = rows - 1;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start;
var end;
var w;
var h;
var path = [];
var diagonal = false;
var run = false;
var neigh = true;
var ran = false;
var ranGen = 0.3;
var noSol = false;
var curr;
var maze = false;
var stack = [];
var aStar = true;
var qSet = [];
var nSet = [];
var cSet = [];
var sSet = [];
var ssSet = [];
var noSolD = 0;
var infinity = 100000;
var live = false;
var real = true;

function Spot(i,j){
    this.i = i;
    this.j = j;
    this.f = 0;
    this.h = 0;
    this.g = 0;
    this.neighbours =[];
    this.previous = undefined;
    this.wall = false;
    this.visited = false;
    this.dist = infinity;
    this.prev = undefined;
    
    this.show = function(col){
      fill(col);
      if(this.wall){
        fill(30);
      }
      stroke(150);
      rect(this.i*w,this.j*h,w-1,h-1)
    }
    
    this.addNeighbours = function(grid){
      if(this.i < cols-1){
        this.neighbours.push(grid[this.i+1][this.j]);
      }
      if(this.i > 0){
        this.neighbours.push(grid[this.i-1][this.j]);
      }
      if(this.j < rows -1){
        this.neighbours.push(grid[this.i][this.j+1]);
      }
      if(this.j > 0){
        this.neighbours.push(grid[this.i][this.j-1]);
      }
      if(diagonal){
        if(i > 0 && j > 0 && !(grid[this.i][this.j-1].wall && grid[this.i-1][this.j].wall)){
          this.neighbours.push(grid[this.i -1][this.j-1]);
        }
        if(i < cols-1 && j > 0 && !(grid[this.i+1][this.j].wall && grid[this.i][this.j-1].wall)){
          this.neighbours.push(grid[this.i +1][this.j-1]);
        }
        if(i > 0 && j < rows - 1 && !(grid[this.i-1][this.j].wall && grid[this.i][this.j+1].wall)){
          this.neighbours.push(grid[this.i -1][this.j+1]);
        }
        if(i < cols -1 && j < rows - 1 && !(grid[this.i][this.j+1].wall && grid[this.i+1][this.j].wall)){
          this.neighbours.push(grid[this.i +1][this.j+1]);
        }
      }
    }
  
    this.checkNeighbours = function(){
      var mazeNeighbours =[];
      
      if(this.i < cols-2 && !grid[this.i+2][this.j].visited){
        mazeNeighbours.push(grid[this.i+2][this.j]);
      }
      if(this.i > 1 && !grid[this.i-2][this.j].visited){
        mazeNeighbours.push(grid[this.i-2][this.j]);
      }
      if(this.j < rows -2 && !grid[this.i][this.j+2].visited){
        mazeNeighbours.push(grid[this.i][this.j+2]);
      }
      if(this.j > 1 && !grid[this.i][this.j-2].visited){
        mazeNeighbours.push(grid[this.i][this.j-2]);
      }
      
      if(mazeNeighbours.length > 0){
        var r = floor(random(0,mazeNeighbours.length));
        return mazeNeighbours[r];
      }else{
        return undefined;
      }
    }
  }


function removeFromArray(arr, elt){
  for(var i = arr.length - 1; i >=0; i--){
    if(arr[i] == elt){
       arr.splice(i,1);
    }
  }
}

function heuristic(a,b){
  var d = 0;
  if(diagonal){
     d = dist(a.i,a.j,b.i,b.j);
  }else{
    d = abs(a.i - b.i) + abs(a.j - b.j);
  }
  return d;
}

function runP(){
  run = true;
}

function ranP(){
  reset();
  ran = true;
}

function ranPos(){
  startx = floor(random(0,cols-1));
  starty = floor(random(0,rows-1));
  
  do{
    endx = floor(random(0,cols-1));
  }while (endx == startx)
    
  do{
    endy = floor(random(0,rows-1));
  }while (endy == starty)
  
  reset();
}

function dia(){
  if(!run)
    diagonal = !diagonal;
}

function liveP(){
  if(!run)
    live = !live;
}

function realT(){
  if(!run && !maze)
    real = !real;
}

function reset(){
  diagonal = checkbox.checked();
  live = checkboxL.checked();
  real = checkboxR.checked();
  input1.value(cols);
  w = width/cols;
  h = height/rows;
  grid = new Array(cols);
  //Makes the 2D array
  for(var i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }
  
  openSet = [];
  closedSet = [];
  
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }
  
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].show(255);
    }
  }
  
  // startx = 0;
  // starty = 0;
  // endx = cols -5;
  // endy = rows - 5;
  
  if(startx < 0){
      startx = cols -1
  }
  if(starty < 0){
    starty = cols -1
  }
  if(endx < 0){
    endx = cols -1
  }
  if(endy < 0){
    endy = cols -1
  }
  
  qSet = [];
  nSet = [];
  cSet = [];
  sSet = [];
  ssSet = [];
  noSolD = 0;
  
  start = grid[startx][starty];
  end = grid[endx][endy];
  start.wall = false;
  end.wall = false;
  
  openSet.push(start);
  run = false;
  neigh = true;
  ran = false;
  noSol = false;
  maze = false;
  
  // sel.option('A*');
  // sel.option('Dijkstra');
  sel.remove();
  sel = createSelect();
  // sel.position(273, height + 2);
  sel.option('A*');
  sel.option('Dijkstra');
  if(!aStar){
    sel.selected('Dijkstra');
  }
  sel.changed(mySelectEvent);
  
  loop();
  
  
}

function colRow(){
  var inp = input1.value();
  if(int(inp)){
    if(int(inp)%2 == 0){
      cols = int(inp) + 1;
    }else{
      cols = int(inp);
    }
    
    if(startx > cols){
      startx = cols -1
    }
    if(starty > cols){
      starty = cols -1
    }
    if(endx > cols){
      endx = cols -1
    }
    if(endy > cols){
      endy = cols -1
    }
    
    rows = cols;
    reset();
  }
}

function fps(){
  var inp = input2.value();
  if(int(inp)){
    frameRate(int(inp));
  }
}

function removeWalls(a, b){
  var x = a.i - b.i;
  var y = a.j - b.j;
  
  if(x == 2){
    grid[a.i -1][a.j].wall = false;
    grid[a.i -1][a.j].visited = true;
  }
  
  if(x == -2){
    grid[a.i + 1][a.j].wall = false;
    grid[a.i +1][a.j].visited = true;
  }
  
  if(y == 2){
    grid[a.i][a.j - 1].wall = false;
    grid[a.i][a.j - 1].visited = true;
  }
  
  if(y == -2){
    grid[a.i][a.j + 1].wall = false;
    grid[a.i][a.j + 1].visited = true;
  }
}

function mazeGen(){
  starty = 0;
  startx = 0;
  endx = cols -1;
  endy = rows - 1;
  
  reset();
  
  maze = true;
  
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].wall = true;
    }
  }
  curr = grid[0][0]; 
}

function createMaze(){
  if(maze && real){
    ran = false;
    curr.visited = true;
    curr.wall = false;

    var mNext = curr.checkNeighbours();

    if(mNext){
      mNext.visited = true;
      
      stack.push(curr);
      
      removeWalls(curr, mNext);
      
      curr = mNext;

    }else if(stack.length > 0){
      curr = stack.pop();
    }
    
    if(stack.length > 0){
      run = false;
    }
  }
  
  while(maze && !real){
    ran = false;
    curr.visited = true;
    curr.wall = false;

    var mNext = curr.checkNeighbours();

    if(mNext){
      mNext.visited = true;
      
      stack.push(curr);
      
      removeWalls(curr, mNext);
      
      curr = mNext;

    }else if(stack.length > 0){
      curr = stack.pop();
    }
    
    if(stack.length > 0){
      run = false;
    }
    
    if(stack.length < 1){
      maze = false;
    }
  }
}

function preRunSetup(){
  if(!run){
    
    if(ran){
      maze = false;
      for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
          grid[i][j].wall = false;
        }
      }
      
      for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
          if(random(1) < ranGen){
            grid[i][j].wall = true;
          }
        }
      }
      
      for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
          grid[i][j].show(255);
        }
      }
      start.wall = false;
      end.wall = false;
      
      ran = false;
    }
    
    for(var i = 0; i < cols; i++){
      for(var j = 0; j < rows; j++){
          var curGrid = grid[i][j];
          if(mouseX >= curGrid.i * w && mouseX <= (curGrid.i*w + w-1) && mouseY >= curGrid.j*h && mouseY <= (curGrid.j*h + h - 1)){
            curGrid.show(color(0,255,0));
            if(mouseIsPressed && curGrid != start && curGrid != end){
              curGrid.wall = true;
            }
          }else{
            curGrid.show(color(255));
          }
        }
    }
    
    if(maze){
      curr.show(color(255,0,255));
    }
    start.show(color(0,130,255));
    end.show(color(255,0,0));
  }
}

function aStarAlg(){
  if(run){
    sel.disable('Dijkstra');
    
    if(neigh){
      for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
          grid[i][j].addNeighbours(grid);
        }
      }
      neigh = false;
    }
    
    var done = false;
    while(openSet.length > 0 && !done && !real){

    var winner = 0;
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }

    var current = openSet[winner];
    
    path = [start];
    if(openSet[winner] === end){ 
      // console.log("DONE!");
      done = true;
      if(!live){
        path = [];
        var temp = current;
        path.push(temp)
        while(temp.previous){
          path.push(temp.previous);
          temp = temp.previous;
        }
      }
      noLoop();  
    }

    // openSet.remove(current);
    removeFromArray(openSet,current);
    closedSet.push(current);

    var neighbours = current.neighbours;
    for(var i = 0; i < neighbours.length; i++){
      var neighbour = neighbours[i];

      if(!closedSet.includes(neighbour) && !neighbour.wall){
        if(diagonal){
          var tempG = current.g + heuristic(neighbour,current);
        }else{
          var tempG = current.g + 1;
        }

        var newPath = false;

        if(openSet.includes(neighbour)){
          if(tempG < neighbour.g){
            neighbour.g = tempG;
            newPath = true;
          }
        }else{
          neighbour.g = tempG;
          newPath = true;
          openSet.push(neighbour);
        }

        if(newPath){
          neighbour.h = heuristic(neighbour,end);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
        }        
      }
    }
    //Keep going
  } 
    
  if(openSet.length == 0 && !done && !real) {
    // console.log("No Solution");
    noSol = true;
    noLoop();
    // return;
    //No Solution
  }
    
  if(openSet.length > 0 && real){

    var winner = 0;
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }

    var current = openSet[winner];
    
    path = [start];
    if(openSet[winner] === end){ 
      // console.log("DONE!");
      if(!live){
        path = [];
        var temp = current;
        path.push(temp)
        while(temp.previous){
          path.push(temp.previous);
          temp = temp.previous;
        }
      }
      noLoop();  
    }

    // openSet.remove(current);
    removeFromArray(openSet,current);
    closedSet.push(current);

    var neighbours = current.neighbours;
    for(var i = 0; i < neighbours.length; i++){
      var neighbour = neighbours[i];

      if(!closedSet.includes(neighbour) && !neighbour.wall){
        if(diagonal){
          var tempG = current.g + heuristic(neighbour,current);
        }else{
          var tempG = current.g + 1;
        }

        var newPath = false;

        if(openSet.includes(neighbour)){
          if(tempG < neighbour.g){
            neighbour.g = tempG;
            newPath = true;
          }
        }else{
          neighbour.g = tempG;
          newPath = true;
          openSet.push(neighbour);
        }

        if(newPath){
          neighbour.h = heuristic(neighbour,end);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
        }        
      }
    }
    //Keep going
  } else if (real) {
    // console.log("No Solution");
    noSol = true;
    noLoop();
    // return;
    
    //No Solution
  }


    for(var i = 0; i < cols; i++){
      for(var j = 0; j < rows; j++){
        grid[i][j].show(color(255));
      }
    }

    for(var i = 0; i < closedSet.length; i++){
      closedSet[i].show(color(255,0,0));
    }

    for(var i = 0; i < openSet.length; i++){
      openSet[i].show(color(0,255,0));
    }

    if(!noSol && live){
      //Find Path    
      path = [];
      var temp = current;
      path.push(temp)
      while(temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
      }
    }
    
    
    end.show(color(255,0,0));

    for(var i = 0; i < path.length; i++){
      path[i].show(color(0,130,255));
    }
  }
}

function dijkstraAlg(){
  if(!run){
    var c = 0;
    for(var i = 0; i < cols; i++){
      for(var j = 0; j < rows; j++){
        qSet[c] = grid[i][j];
        c++;
      }
    }
  }
  
  if(run){
    sel.disable('A*');
    
    if(neigh){
      for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
          grid[i][j].addNeighbours(grid);
        }
      }
      neigh = false;
    }
    
    start.dist = 0;
    
    if(qSet.length > 0 && real){
      var u = qSet[0];
      for(var i = 1; i < qSet.length; i++){
        if(qSet[i].dist < u.dist){
          u = qSet[i];
        }
      }  
      
      removeFromArray(qSet,u);
      cSet.push(u);
      
      var neighbours = u.neighbours;
      for(var i = 0; i < neighbours.length; i++){
        var v = neighbours[i];
        nSet.push(v);
        
        if(u == end){
          // console.log("DONE")
          sSet = [start];
          while(u.prev && !live){
            sSet.push(u);
            u = u.prev;
          }
          noLoop();
        }
        
        
        if(qSet.includes(v) && !v.wall){
          var alt = dist(u.i,u.j,v.i,v.j) + u.dist;
          if(alt < v.dist){
            v.dist = alt;
            v.prev = u;
          }
        }
      }
    }
    
    var doneD = false;
    while(qSet.length > 0 && !real && !doneD){
      var u = qSet[0];
      for(var i = 1; i < qSet.length; i++){
        if(qSet[i].dist < u.dist){
          u = qSet[i];
        }
      }
      
      removeFromArray(qSet,u);
      cSet.push(u);
      
      var neighbours = u.neighbours;
      for(var i = 0; i < neighbours.length; i++){
        var v = neighbours[i];
        nSet.push(v);
        
        if(u == end){
          // console.log("DONE")
          done = true;
          sSet = [start];
          while(u.prev){
            sSet.push(u);
            u = u.prev;
          }
          
          for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
              grid[i][j].show(color(255));
            }
          }

          for(var j = 0; j < nSet.length; j++){
            nSet[j].show(color(0,255,0));
          }

          for(var j = 0; j < cSet.length; j++){
            cSet[j].show(color(255,0,0));
          }
          end.show(color(255,0,0));
          for(var j = 0; j < sSet.length; j++){
            sSet[j].show(color(0,130,255));
          }
          noLoop();
        }
        
        
        if(qSet.includes(v) && !v.wall){
          var alt = dist(u.i,u.j,v.i,v.j) + u.dist;
          if(alt < v.dist){
            v.dist = alt;
            v.prev = u;
          }
        }
      }
    }
    
    ssSet = [start];
    while(u.prev){
      ssSet.push(u);
      u = u.prev;
    }
    
    if(ssSet.length == 1 && noSolD == 1){
       // console.log("No Solution");
        noLoop();
    }
    
    noSolD = 1;
    if(real){
      for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
          grid[i][j].show(color(255));
        }
      }

      for(var j = 0; j < nSet.length; j++){
        nSet[j].show(color(0,255,0));
      }

      for(var j = 0; j < cSet.length; j++){
        cSet[j].show(color(255,0,0));
      } 
      end.show(color(255,0,0));
      if(live){
        for(var j = 0; j < ssSet.length; j++){
          ssSet[j].show(color(0,130,255));
        }
      }else{
        for(var j = 0; j < sSet.length; j++){
          sSet[j].show(color(0,130,255));
        }
      }
    }
    
    start.show(color(0,130,255));
    
  }
}

function createInputs(){
  checkbox = createCheckbox('Diagonal', false);
  checkbox.changed(dia);
  checkbox.position(4, 120);
  
  checkboxL = createCheckbox('Live Path Update', false);
  checkboxL.changed(liveP);
  checkboxL.position(4, 150);
  
  checkboxR = createCheckbox('Real-Time', true);
  checkboxR.changed(realT);
  checkboxR.position(4, 180);
  
  let runButton = createButton("Run");
  runButton.mousePressed(runP);
  
  let ranButton = createButton("Random");
  ranButton.mousePressed(ranP);
  
  let mazeButton = createButton("Maze");
  mazeButton.mousePressed(mazeGen);
  
  let ranPosButton = createButton("RanPos");
  ranPosButton.mousePressed(ranPos);
  
  let resetButton = createButton("Reset");
  resetButton.mousePressed(reset);
  
  // textSize(15)
  let a = createA('https://github.com/YashrajN/Path-Finding-Algorithm-with-Maze-Gen-Algorithm/wiki/Instructions', 'Instructions', '_blank');
  a.position(28, 220);;
  
  
  input1 = createInput();
  // input1.position(0, height + 45);
  input1.value(cols);

  button = createButton('Grid');
  // button.position(input1.x + input1.width, height + 45);
  button.mousePressed(colRow);
  
  
  input2 = createInput();
  // input2.position(0, height + 70);
  input2.value(60);

  fr = createButton('Speed (fps)');
  // fr.position(input2.x + input2.width, height + 70);
  fr.mousePressed(fps);
  
  sel = createSelect();
  // sel.position(273, height + 2);
  sel.option('A*');
  sel.option('Dijkstra');
  sel.changed(mySelectEvent);
  
  
}

function mySelectEvent(){
  aStar = !aStar;
}

function setup(){
  createCanvas(wid, len);  
  
  w = width/cols;
  h = height/rows;
  //Makes the 2D array
  for(var i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }
  
  
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }
  
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].show(255);
    }
  }
  
  start = grid[startx][starty];
  end = grid[endx][endy];
  start.wall = false;
  end.wall = false;
  
  openSet.push(start);
  
  // console.log(grid);
  
  createInputs();
  
}

function draw() {
  // background(150);
  
  createMaze();
  
  preRunSetup();
  
  if(aStar){
    aStarAlg();
  }else{
    dijkstraAlg();
  }

}