const mario = {  

  //=========================
  //! GAME SCENARIO 
  //=========================
  
  /* * * * * * * *
  * INIT THE APP *
  */ 
  init: function() {

    //! START: DRAW BOARD
    mario.drawBoard();

    //! LISTEN: START BUTTON
    let startButtonElement = mario.get('#startButton');
    mario.listen(startButtonElement, "click", mario.handleStartScript)

    //! LISTEN: RESET BUTTON
    let resetButtonElement = mario.get('#resetButton');
    mario.listen(resetButtonElement, "click", mario.resetGame)
    mario.listen(resetButtonElement, "click", mario.resetErrors)
    mario.listen(resetButtonElement, "click", mario.resetTextArea)

  },

  /* * * * * *
  * DRAWBOARD *
  */ 
  drawBoard: function() {

   //! GET : BOARD ELEMENT
   let boardElement = mario.get('#board');

    //! CREATE 4 ROWS
    for(let rowIndex = 1; rowIndex < 5; rowIndex++) {
      let rowElement = document.createElement('div');
      rowElement.className = 'cellRow';
      rowElement.id = 'row' + rowIndex;
      boardElement.appendChild(rowElement);

      //! CREATE 6 CELLS
      for(let cellIndex = 1; cellIndex < 7; cellIndex++) {
        let cellElement = document.createElement('div');
        cellElement.className = 'cell';
        rowElement.appendChild(cellElement);
      }

    }

    mario.startAndEndPositions();
    mario.resetTextArea();

  },

  /* * * * * * * * * * * * *
  * START AND END POSITIONS *
  */ 
  startAndEndPositions: function(){

    //! GET : CELL LIST
    let cellListElement = mario.getAll(".cell");

    //! GET : CELL LIST LENGHT
    let lengthValue = cellListElement.length;

      //! RANDOM START CELL
      let randomStart = cellListElement[mario.random(1, lengthValue - 1)];
      randomStart.classList.add('cellCurrent');

      //! RANDOM END CELL != RANDOM START CELL
      let randomEnd = "";
      do { randomEnd = cellListElement[mario.random(1, lengthValue - 1)] } while (randomEnd == randomStart);
      randomEnd.classList.add('cellEnd');

  },

  /* * * * * * * *
  * START SCRIPT *
  */ 
  handleStartScript: function() {

    //! GET: USER INPUT VALUE
    let userCodeElementValue = mario.get('#userCode').value;

    //! Create array with values
    let codeLines = [];
    codeLines.push(userCodeElementValue.split(/\r?\n/));

    window.setTimeout(function() {
      mario.userEntries(codeLines, 0);
    }, 100); 

  },

  /* * * * * * * *
  * USER ENTRIES *
  */ 
  userEntries: function(codeLines, index) {

    //! START : RESET ERRORS
    mario.resetErrors();

    //! GET: CURRENT LINE
    var currentLine = codeLines[index];

    // INCREMENT
    index++;
    
    // GET: LINES
    if (index < codeLines.length) {
      window.setTimeout(function() {
        mario.userEntries(codeLines, index);
      }, 50);
    } else {
      window.setTimeout(function() {
        mario.checkSuccess();
      }, 50);
    }

    //! START : CHECK VALUE AND MOVE
    mario.checkUserValueAndMove(currentLine);

  },

  /* * * * * * * * * * * *
  * CHECK VALUES AND MOVE *
  */ 
  checkUserValueAndMove: function(currentLine) {

    for (let value of currentLine) {

      let id = mario.getCurrentCellId();

        if (value === 'move forward') {   

            if ((mario.checkRotation() === 'cellCurrent-bottom') && ((id >= 17))) {

              mario.displayErrors();

              } else if ((mario.checkRotation() === 'cellCurrent-top') && ((id <= 5))) {

                  mario.displayErrors();

              } else if ((mario.checkRotation() === 'cellCurrent') && ((id === 5) || (id === 11) || (id === 17) || (id === 23))) {

                mario.displayErrors();

              } else if ((mario.checkRotation() === 'cellCurrent-left') && ((id === 0) || (id === 6) || (id === 12) || (id === 18))) {

                mario.displayErrors();           

            } else {  

              mario.moveForward();

            }

            
        }
        else if(value === 'turn right') {

          mario.turnRight();

        }
        else if(value === 'turn left') {

          mario.turnLeft();

        } 

        else if (value.substr(0,4) === "mario.") {

          mario.displayErrors();

        }   

      }

      mario.resetTextArea();

  },    

  /* * * * * * * *
  * MOVE FORWARD *
  */ 
  moveForward: function() {
    
    let currentCellElement = mario.getCurrentCellElement();

    // CHECK ROTATION & MOVE FORWARD
    switch (mario.checkRotation()) {

      case 'cellCurrent-top':
        let closetTopCellElement = mario.getClosestTopCell();
        mario.addClass('cellCurrent-top', closetTopCellElement);
        break;

      case 'cellCurrent-bottom':
        let closetBottomCell = mario.getClosestBottomCell();
        mario.addClass('cellCurrent-bottom', closetBottomCell);
        break;

      case 'cellCurrent-left':
        mario.addClass('cellCurrent-left', currentCellElement.previousElementSibling);
        break;
 
      default:
        mario.addClass('noClass', currentCellElement.nextElementSibling);

    }

  },

  /* * * * * * *
  * TURN RIGHT *
  */ 
  turnRight: function() {

    // CHECK ROTATION & TURN RIGHT
    switch (mario.checkRotation()) {

      case 'cellCurrent-top':
        mario.addClass('cellCurrent-right');
        break;

      case 'cellCurrent-bottom':
        mario.addClass('cellCurrent-left');
        break;

      case 'cellCurrent-left':
        mario.addClass('cellCurrent-top');
        break;
 
      default:
        mario.addClass('cellCurrent-bottom');

    }
  },

  /* * * * * *
  * TURN LEFT *
  */ 
  turnLeft: function() {

    // CHECK ROTATION & TURN LEFT
    switch (mario.checkRotation()) {

      case 'cellCurrent-top':
        mario.addClass('cellCurrent-left');
        break;

      case 'cellCurrent-bottom':
        mario.addClass('cellCurrent-right');
        break;

      case 'cellCurrent-left':
        mario.addClass('cellCurrent-bottom');
        break;
  
      default:
        mario.addClass('cellCurrent-top');

    }

  },

  /* * * * * * * *
  * CHECK SUCCESS *
  */ 
  checkSuccess: function() {

    let cellEndElement = mario.get('.cellEnd');

    if(cellEndElement.classList.contains('cellCurrent')){
      let success = mario.get('#success');
      success.style.display = 'block';
      cellEndElement.className='cell';  
    }

  },

  /* * * * * * * *
  * DISPLAY ERRORS *
  */ 
  displayErrors: function() {

    let failElement = mario.get('#fail');
    failElement.style.display = 'block';
    let currentCellElement = mario.get('.cellCurrent');
    currentCellElement.className = 'cell';
    let cellEndElement = mario.get('.cellEnd');
    cellEndElement.className='cell';  
    
    mario.resetTextArea();

  },

  /* * * * * * *
  * RESET BOARD *
  */ 
  resetGame: function() {

    let success = mario.get('#success');
    success.style.display = 'none';

    for(let rowIndex = 1; rowIndex < 5; rowIndex++) {
      let rowElement = mario.get('.cellRow')
      rowElement.remove();
    }

    mario.drawBoard();

  },

  //================================================================================
  //! GAME USEFULL FUNCTIONS : CELLS 
  //================================================================================

  /* * * * * * * * * * * 
  * GET CURRENT CELL ID *
  */ 
  getCurrentCellId: function() {

    let cellListElement = mario.getAll('.cell');

    for (let cell in cellListElement) {

        let currentCellElement = cellListElement[cell];

        if(currentCellElement.classList.contains('cellCurrent')){

          return parseInt(cell);
        }
    }
  },

  /* * * * * * * * * * * * * *
  * GET CURRENT CELL ELEMENT *
  */ 
  getCurrentCellElement: function() {

    let cellListElement = mario.getAll('.cell');
    for (let cell in cellListElement) {
        let currentCellElement = cellListElement[cell];
        if(currentCellElement.classList.contains('cellCurrent')){
          return currentCellElement;
        }
    }
  },

  /* * * * * * * * * * * * * *
  * GET CLOSEST BOTTOM CELL *
  */ 
  getClosestBottomCell : function() {

    let cellListElement = mario.getAll('.cell');
    for (let cellCurrentNumber in cellListElement) {
        let currentCellElement = cellListElement[cellCurrentNumber];
        if(currentCellElement.classList.contains('cellCurrent')) {
          let cellBottomNumber = parseInt(cellCurrentNumber) + 6;
          let closestBottomCell = cellListElement[cellBottomNumber];
          return closestBottomCell;
        }
    }
  },


  /* * * * * * * * * * * *
  * GET CLOSEST TOP CELL *
  */ 
  getClosestTopCell : function() {

    let cellListElement = mario.getAll('.cell');
    for (let cellCurrentNumber in cellListElement) {
        let currentCellElement = cellListElement[cellCurrentNumber];
        if(currentCellElement.classList.contains('cellCurrent')) {
          let cellTopNumber = parseInt(cellCurrentNumber) - 6;
          let closestTopCell = cellListElement[cellTopNumber];

          return closestTopCell;
        }
    }   
  },

  //================================================================================
  //! GAME USEFULL FUNCTIONS : CURSOR 
  //================================================================================

  /* * * * * * * * * * * *
  * CHECK CURSOR ROTATION *
  */ 
  checkRotation: function() {

    let currentCellElement = mario.get('.cellCurrent');

    if (currentCellElement.classList.contains('cellCurrent-top')){
      return 'cellCurrent-top';

    } else if (currentCellElement.classList.contains('cellCurrent-bottom')) {
      return 'cellCurrent-bottom';

    } else if (currentCellElement.classList.contains('cellCurrent-left')) {
      return 'cellCurrent-left';

    } else {
      return 'cellCurrent';
      
    }
  },

  //================================================================================
  //! GAME USEFULL FUNCTIONS : RESETS 
  //================================================================================

  /* * * * * * * *
  * RESET ERRORS *
  */ 
  resetErrors: function() {
  let failElement = mario.get('#fail');
  failElement.style.display = 'none';
  },

  /* * * * * * * * *
  * RESET CLASSNAME *
  */ 
  resetClassName: function() {
  let currentCellElement = mario.get('.cellCurrent');
  currentCellElement.className = 'cell';
  },

  /* * * * * * * * *
  * RESET TEXTAREA *
  */ 
  resetTextArea: function() {
    let userCodeElement = mario.get('#userCode');
    userCodeElement.value = "";
  },

  //================================================================================
  //! GAME USEFULL FUNCTIONS : GET & LISTEN 
  //================================================================================

  /* * * * * * * * *
  * GET DOM ELEMENT *
  */ 
  get: function(selector) {
    let element = document.querySelector(selector);
    return element;
  },

  /* * * * * * * * * * * * * *
  * GET MULTIPLE DOM ELEMENTS *
  */ 
  getAll: function(selector) {
    let element = document.querySelectorAll(selector);
    return element;
  },

  /* * * * * * * * *
  * LISTEN ELEMENTS *
  */ 
  listen: function(element, event, callback) {
    element.addEventListener(event, callback);
  },

  //================================================================================
  //! GAME USEFULL FUNCTIONS : CLASS 
  //================================================================================

  /* * * * * * * * * * * * *
  * ADD CLASS TO AN ELEMENT *
  */ 
  addClass: function(newClass, element=mario.getCurrentCellElement()) {
    let currentCellElement = mario.getCurrentCellElement();
    currentCellElement.className = 'cell';
    element.classList.add('cellCurrent', newClass);
  },

  //================================================================================
  //! GAME USEFULL FUNCTIONS : OTHERS 
  //================================================================================

  /* * * * * * * * * * 
  * GET RANDOM NUMBER *
  */ 
  random: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

}

document.addEventListener('DOMContentLoaded', mario.init);
