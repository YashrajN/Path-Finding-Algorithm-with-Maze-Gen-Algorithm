var cols = 35;
var rows = 35;
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
    
    this.show = function(col){
      fill(col);
      if(this.wall){
        fill(30);
      }
      stroke(0);
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
        if(i > 0 && j > 0 && 9+!(grid[this.i][this.j-1].wall && grid[this.i-1][this.j].wall)){
          this.neighbours.push(grid[this.i -1][this.j-1]);
        }
        if(i < cols-1 && j > 0 && !(grid[this.i+1][this.j].wall && grid[this.i][this.j-1].wall)){
          this.neighbours.push(grid[this.i +1][this.j-1]);
        }
        if(i > 0 && j < rows - 1 && !(grid[this.i - 1][this.j].wall && grid[this.i][this.j+1].wall)){
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
  rest();
  ran = true;
}

function dia(){
  if(!run)
    diagonal = !diagonal;
}

function rest(){
//   console.log("HEKLOODJS");
  diagonal = checkbox.checked();
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
  
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;
  
  openSet.push(start);
  run = false;
  neigh = true;
  ran = false;
  noSol = false;
  maze = false;
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
    
    rows = cols;
    rest();
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
  rest();
  maze = true;
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].wall = true;
    }
  }
  curr = grid[0][0];
  
}

function setup(){
  createCanvas(450, 450);  
  
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
  
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;
  
  openSet.push(start);
  
  console.log(grid);
  let runButton = createButton("Run");
  runButton.mousePressed(runP);
  
  let ranButton = createButton("Random");
  ranButton.mousePressed(ranP);
  
  let mazeButton = createButton("Maze");
  mazeButton.mousePressed(mazeGen);
  
  let resetButton = createButton("Reset");
  resetButton.mousePressed(rest);
  
  
  input1 = createInput();
  input1.position(0, height + 45);
  input1.value(cols);

  button = createButton('Grid');
  button.position(input1.x + input1.width, height + 45);
  button.mousePressed(colRow);
  
  
  checkbox = createCheckbox('Diagonal', false);
  checkbox.changed(dia);
  
  
  input2 = createInput();
  input2.position(0, height + 70);
  input2.value(60);

  fr = createButton('Speed (fps)');
  fr.position(input2.x + input2.width, height + 70);
  fr.mousePressed(fps);
  
  curr = grid[0][0];
  
}

function draw() {
  // background(255);
  
  if(maze){
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
            if(mouseIsPressed){
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
  
  if(run){
    if(neigh){
      for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
          grid[i][j].addNeighbours(grid);
        }
      }
      neigh = false;
    }
    
    if(openSet.length > 0){

    var winner = 0;
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }

    var current = openSet[winner];

    if(openSet[winner] === end){ 
      console.log("DONE!");
      noLoop();  
    }

    // openSet.remove(current);
    removeFromArray(openSet,current);
    closedSet.push(current);

    var neighbours = current.neighbours;
    for(var i = 0; i < neighbours.length; i++){
      var neighbour = neighbours[i];

      if(!closedSet.includes(neighbour) && !neighbour.wall){
        var tempG = current.g + 1;

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
  } else {
    console.log("No Solution");
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

    if(!noSol){
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





