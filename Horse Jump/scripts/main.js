// doesn't work on mobile devices (At least not on mine)
// version 0.2.2 - Board created completely from JavaScript, optical improvements
// version 0.2.3 - added Mouseover for selectable fields
'use strict'
let xarr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let yarr = [8, 7, 6, 5, 4, 3, 2, 1];
let lastx = undefined;
let lasty = undefined;
let moveCounter = 0;
let board = new Array();
let showCounterInFields = true;
let showPreviewInFields = true;
let moveList = [];
let auto = false;
let prevColor = "";

class Field {
    constructor(coordx, coordy, visit, active, possibleMoves, color, canbeselected, move) {
        this.coordx = coordx;
        this.coordy = coordy;
        this.visit = visit;
        this.active = active;
        this.possibleMoves = possibleMoves;
        this.color = color;
        this.canbeselected = canbeselected;
        this.move = move;
    }
}

function createBoard() { //Initial action on load - Draws the divs and creates the Field-Objects
    drawBoard(); 
    for (let i=0;i<8;i++) {
        board[i] = new Array();
        for (let j=0;j<8;j++) {
            board[i][j] = new Field(xarr[i], yarr[j], false, false, [], 'black', true, 0);
            if (i%2 === j%2) {
                board[i][j].color='white';
                document.getElementById(i.toString()+j.toString()).style.backgroundColor="#ffff99"
            }
        }   
    }
    for (let i=0;i<8;i++) { //initiation for possible moves for every field, EventListener for clicking and mouseover color change
        for (let j=0;j<8;j++) {
            calcPossibleMoves(i,j);
            document.getElementById(i.toString()+j.toString()).addEventListener("click", function(){ activate(i,j)});
            document.getElementById(i.toString()+j.toString()).addEventListener("mouseover", function(){ canselect(i,j)});
        }
    }
    document.getElementById("lazy").addEventListener("click", function(){autoFill()});
    // here I have to delete every eventlistener except ("click", function(){ activate(i,j)}) from every field,
    // otherwise moving the mouse while completing somehow messes up with algorithm...
}

function canselect(x,y){ //changes color of visitable fields to black, resets color of previous field
    prevColor = document.getElementById(x.toString()+y.toString()).style.backgroundColor;
    if (board[x][y].canbeselected === true){
        document.getElementById(x.toString()+y.toString()).style.backgroundColor="gray";
        document.getElementById(x.toString()+y.toString()).addEventListener("mouseleave", function(){restoreColor(x,y)});
        document.getElementById(x.toString()+y.toString()).addEventListener("click", function(){restoreColor(x,y)});
        document.getElementById(x.toString()+y.toString()).removeEventListener("mouseover", function(){canselect(x,y)});
    } else {document.getElementById(x.toString()+y.toString()).removeEventListener("mouseleave", function(){restoreColor(x,y)});}
}


function restoreColor(x,y){    //restores color of field on mouseleave
    document.getElementById(x.toString()+y.toString()).style.backgroundColor=prevColor;
    document.getElementById(x.toString()+y.toString()).removeEventListener("mouseleave", function(){restoreColor(x,y)});
    document.getElementById(x.toString()+y.toString()).removeEventListener("click", function(){restoreColor(x,y)});
}


function calcPossibleMoves(x,y) { //Adds the possible Moves for every field to Array .possibleMoves
    if (x+2 >= 0 && y+1 >= 0 && x+2 < 8 && y+1 < 8) {
        if (board[x+2][y+1].visit === false) {
            board[x][y].possibleMoves.push(board[x+2][y+1].coordx+board[x+2][y+1].coordy)
        }
    }
    if (x+1 >= 0 && y+2 >= 0 && x+1 < 8 && y+2 < 8) {
        if (board[x+1][y+2].visit === false) {
            board[x][y].possibleMoves.push(board[x+1][y+2].coordx+board[x+1][y+2].coordy)
        }
    }
    if (x-1 >= 0 && y+2 >= 0 && x-1 < 8 && y+2 < 8) {
        if (board[x-1][y+2].visit === false) {
            board[x][y].possibleMoves.push(board[x-1][y+2].coordx+board[x-1][y+2].coordy)
        }
    }
    if (x-2 >= 0 && y+1 >= 0 && x-2 < 8 && y+1 < 8) {
        if (board[x-2][y+1].visit === false) {
            board[x][y].possibleMoves.push(board[x-2][y+1].coordx+board[x-2][y+1].coordy)
        }
    }
    if (x-2 >= 0 && y-1 >= 0 && x-2 < 8 && y-1 < 8) {
        if (board[x-2][y-1].visit === false) {
            board[x][y].possibleMoves.push(board[x-2][y-1].coordx+board[x-2][y-1].coordy)
        }
    }
    if (x-1 >= 0 && y-2 >= 0 && x-1 < 8 && y-2 < 8) {
        if (board[x-1][y-2].visit === false) {
            board[x][y].possibleMoves.push(board[x-1][y-2].coordx+board[x-1][y-2].coordy)
        }
    }
    if (x+1 >= 0 && y-2 >= 0 && x+1 < 8 && y-2 < 8) {
        if (board[x+1][y-2].visit === false) {
            board[x][y].possibleMoves.push(board[x+1][y-2].coordx+board[x+1][y-2].coordy)
        }
    }
    if (x+2 >= 0 && y-1 >= 0 && x+2 < 8 && y-1 < 8) {
        if (board[x+2][y-1].visit === false) {
            board[x][y].possibleMoves.push(board[x+2][y-1].coordx+board[x+2][y-1].coordy)
        }
    }
}

function selectNothing() { //makes every field unselectable and writes possible moves in td[i][j]
    for (let i=0;i<8;i++) {
            for (let j=0;j<8;j++) {
                board[i][j].canbeselected = false;
                if (showCounterInFields === true) {
                    if (board[i][j].visit === false) {
                        document.getElementById(i.toString()+j.toString()).innerHTML = board[i][j].possibleMoves.length;
                    } else {document.getElementById(i.toString()+j.toString()).innerHTML = board[i][j].move;
                            document.getElementById(i.toString()+j.toString()).style.color="white";
                            document.getElementById(i.toString()+j.toString()).style.fontSize="20px";
                            document.getElementById(i.toString()+j.toString()).style.lineHeight="3em";
                    }
                }
            }
    }
    
}

function undo() {
   let undoList = moveList;
   window.location.reload();
   return undoList; // this works, but when trying to use return value for setting new variable, nothing...???
   
   //for i in undoList.length - undolist[pos1] - activate
}

function autoFill() { //lets computer try to complete the tour
    let counter = moveCounter;
    let delay = 100;  // delay in ms for each activation
    auto = true;
    for (let k=0; k<(64-counter); k++) {
        (function(k){
            setTimeout(function(){
                let minmoves = 9;
                let mincoord = "";
                for (let i=0;i<8;i++) {
                    for (let j=0;j<8;j++) {
                        if ((board[i][j].canbeselected === true) && (board[i][j].possibleMoves.length < minmoves)) {
                            minmoves = board[i][j].possibleMoves.length;
                            mincoord = board[i][j].coordx + board[i][j].coordy;
                        }
                    }
                }
                let xnew = xarr.indexOf(mincoord.slice(0,1));
                let ynew = yarr.indexOf(parseInt(mincoord.slice(-1)));
                //here should be a try-catch for TypeErrors
                //happens only if computer cant finish autofill()
                activate(xnew, ynew);
                }, delay * k);
            }(k));
    }
}

function reload() { //reloads window (like pressing F5)
    window.location.reload(); 
}

function saveAsFile() { //not yet implemented
    
}

function loadFromFile() { //not yet implemented
    
    
}
function drawBoard() { //Creates the html
    let toAdd = document.createDocumentFragment();
    let distanceFromTop = 70;
    let distanceFromLeft = 70;
    let squareSize = 60;
    for (let i=0;i<8;i++) {
        let newLegX = document.createElement('div');
        newLegX.innerHTML = yarr[i];
        newLegX.id= 'legend';
        toAdd.appendChild(newLegX);
        newLegX.style.left=(i*squareSize+distanceFromTop).toString()+"px";
        newLegX.style.height="60px";
        newLegX.style.width="60px";
        let newLegY = document.createElement('div');
        newLegY.innerHTML = xarr[i];
        newLegY.id= 'legend';
        toAdd.appendChild(newLegY);
        newLegY.style.top=(i*squareSize+distanceFromTop).toString()+"px";
        newLegY.style.height="60px";
        newLegY.style.width="60px";
        for (let j=0;j<8;j++) {
            let newDiv = document.createElement('div');
            newDiv.id = i.toString()+j.toString();
            let textI = (i*squareSize+distanceFromTop).toString();
            let textJ = (j*squareSize+distanceFromLeft).toString();
            newDiv.className = 'boardfield';
            toAdd.appendChild(newDiv);
            newDiv.style.top=textI+"px";
            newDiv.style.left=textJ+"px";
            newDiv.style.height=squareSize.toString()+"px";
            newDiv.style.width=squareSize.toString()+"px";
            newDiv.style.position="absolute";
        }
    }
    document.getElementById('koerper').appendChild(toAdd);
}

function drawPattern() { // not yet implemented
    
}

function openSurroundingFields(x,y) { //makes unvisited fields selectable which are in the .possibleMoves from actual field
    for (let k=0;k < board[x][y].possibleMoves.length; k++){
           let letter =  board[x][y].possibleMoves[k].slice(0,1);
           let number =  board[x][y].possibleMoves[k].slice(1);
           let letterIndex = xarr.indexOf(letter);
           let numberIndex = yarr.indexOf(parseInt(number));
           if (board[letterIndex][numberIndex].visit === false) {board[letterIndex][numberIndex].canbeselected = true}
           if (auto === true) {document.getElementById('visitable').innerHTML = "The computer is trying to finish it..."}
    }
}

function activate(x,y) { //main function for setting the horse on board[x][y]
    if (board[x][y].canbeselected === true) {
        if (lastx != undefined) { //if there is a previous field, format css
            document.getElementById(lastx.toString()+lasty.toString()).style.backgroundImage="none";
            if (board[lastx][lasty].color === 'white') { // possible to set different colors depending on field-color
                document.getElementById(lastx.toString()+lasty.toString()).style.backgroundColor="#660033";
            } else {document.getElementById(lastx.toString()+lasty.toString()).style.backgroundColor="#660033";
            }
        }
    
        lastx = x;
        lasty = y;
        board[x][y].active = true;
        board[x][y].visit = true;
        
        moveCounter += 1;
        document.getElementById('movecounter').innerHTML = "Moved so far: " + moveCounter + " time";
        if (moveCounter > 1){document.getElementById('movecounter').innerHTML = document.getElementById('movecounter').innerHTML +"s"}
        board[x][y].move = moveCounter;
        
        document.getElementById(x.toString()+y.toString()).style.backgroundImage="url('pictures/horse.svg')";
        if (board[x][y].possibleMoves.length > 0) {
            document.getElementById('visitable').innerHTML = board[x][y].possibleMoves;
        } else if ((auto === false) && (moveCounter < 64)){document.getElementById('visitable').innerHTML = "none anymore :-\("
            
        } else if (auto === true){
            document.getElementById('visitable').innerHTML = "The computer did it! Great \;\-\)";
            document.getElementById(x.toString()+y.toString()).style.backgroundImage="none";
            document.getElementById(x.toString()+y.toString()).style.backgroundColor="#660033";
        } else {document.getElementById('visitable').innerHTML = "You did it! Congratulations!";
                document.getElementById('visitable').style.backgroundColor="red";
                document.getElementById(x.toString()+y.toString()).style.backgroundImage="none";
                document.getElementById(x.toString()+y.toString()).style.backgroundColor="#660033";
        }
        
        let fieldnow = board[x][y].coordx+board[x][y].coordy;// for Example 'A1'
        moveList.push(" "+fieldnow);
        document.getElementById('movelist').innerHTML = moveList;
        if (auto === true) { document.getElementById('movelist').style.color="red"}
        
        for (let i=0;i<8;i++) {
           for (let j=0;j<8;j++) {
                if (board[i][j].possibleMoves.indexOf(fieldnow) > -1) 
                { // for Example if 'A1' in .possibleMoves
                   let listIndex = board[i][j].possibleMoves.indexOf(fieldnow); //position of 'A1'
                   let newIndex = board[i][j].possibleMoves.splice(listIndex,1); //
                    
                }
              
               
        }
            
            
        }
        selectNothing(); //makes every field unselectable
        openSurroundingFields(x,y);  //makes unvisited fields selectable which are in the .possibleMoves from actual field
         
        
        
    }
        
}   

