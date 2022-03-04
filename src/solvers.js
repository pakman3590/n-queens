/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = undefined; //fixme
  // create new n x n board
  let brd = new Board({ n: n });
  console.log((new Board({n: n})).rows());
  console.log(brd.rows());
  debugger;
  // new recursive
  let addRook = function (board, currN) {
    // make copy of board
    let newBoard = new Board(board.rows());
    // loop through matrix
    for (let i = 0; i < newBoard.get(('n')); i ++) {
      for (let j = 0; j < newBoard.get('n'); j ++) {
        // check if solution solved
        if (solution) {
          break;
        }
        // check if occupied
        if (newBoard.rows()[i][j] === 0) {
          // place new piece
          newBoard.rows()[i][j] = 1;
          // rook exclusion
          newBoard.rookExclusion(newBoard, i, j);
          // (base case) if # rooks equals input n
          if (currN === n) {
            // assign current board to solution
            solution = newBoard.rows();
            // return
            return;
          }
          // (recursive case)
          // invoke recursion with current board and n + 1
          addRook(newBoard, currN + 1);
        }
      }
    }

  };
  // // begin recursion
  addRook(brd, 1);


  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;

  // create new n x n board
  var potato = new Board({n: n});
  console.log(new Board({n: n}));
  console.log(potato);
  debugger;
  // new recursive
  let addRook = function (potato, currN) {
    // loop through matrix
    for (let i = 0; i < potato.get(('n')); i ++) {
      for (let j = 0; j < potato.get('n'); j ++) {
        //console.log(`[${i}, ${j}], currN: ${currN}, solnCt: ${solutionCount}`)
        // make copy of board
        let newBoard = potato.rows().slice();
        //console.log(newBoard.rows())
        // check if occupied
        if (newBoard[i][j] === 0) {
          // place new piece
          newBoard[i][j] = 1;
          // rook exclusion
          newBoard = new Board(newBoard);
          newBoard.rookExclusion(newBoard, i, j);
          // (base case) if # rooks equals input n
          if (currN === n) {
            // assign current board to solution
            solutionCount ++;
            // return
            return;


            // // make copy of board
            // let newBoard = new Board(potato.rows());
            // //console.log(newBoard.rows())
            // // check if occupied
            // if (newBoard.rows()[i][j] === 0) {
            //   // place new piece
            //   newBoard.rows()[i][j] = 1;
            //   // rook exclusion
            //   newBoard.rookExclusion(newBoard, i, j);
            //   // (base case) if # rooks equals input n
            //   if (currN === n) {
            //     // assign current board to solution
            //     solutionCount ++;
            //     // return
            //     return;

          }
          // (recursive case)
          // invoke recursion with current board and n + 1
          addRook(newBoard, currN + 1);
        }
      }
    }

  };

  // begin recursion
  addRook(potato, 1);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
