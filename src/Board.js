// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },
    // generates unique label for all in diagonal
    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // VALUE FINDER helper function
    valueFinder: function(rowIndex, colIndex) {
      return this.rows()[rowIndex][colIndex];
    },

    // CONFLICT CHECKER helper function
    conflictChecker: function(arr) {
      var occupied = false;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === 1) {
          if (occupied === true) {
            return true;
          }
          occupied = true;
        }
      }
      return false;
    },

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // I: row index
      // O: boolean - true if more than one value in the row is 1
      // C: bounds of board
      // E:
      return this.conflictChecker(this.rows()[rowIndex]);
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //var row = this.rows();
      // loop through every row
      for (let i = 0; i < this.get('n'); i++) {
        // check if row has conflict
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // make column array
      let column = [];
      // loop though rows
      for (let i = 0; i < this.get('n'); i ++) {
        // push each value @ column index to column array
        column.push(this.rows()[i][colIndex]);
      }
      // return conflictchecker on array
      return this.conflictChecker(column);
    },

    // test if any columns on this board contain conflicts
    // iterate over 'columns' and invoke hascolconflictat on each
    // returns true if any are true, otherwise return false
    hasAnyColConflicts: function() {
      // for loop though col indicies
      for (let i = 0; i < this.get('n'); i ++) {
        // check if hascolconflictat is true
        if (this.hasColConflictAt(i)) {
          // return true
          return true;
        }
      }
      return false;
    },


    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(diagonalIndex) {
      // convert diagonal index into starting matrix position, saved as a variable
      var diagonalPos = [0, 0];
      if (diagonalIndex > 0) {
        diagonalPos = [0, diagonalIndex];
      } else if (diagonalIndex < 0) {
        diagonalPos = [Math.abs(diagonalIndex), 0];
      }
      // create diagonal array
      var diagonalArray = [];
      // loop through diagonal values
      while (this._isInBounds(...diagonalPos)) {
        // push starting matrix position variable into array
        diagonalArray.push(this.valueFinder(...diagonalPos));
        // increment pos
        diagonalPos[0] ++;
        diagonalPos[1] ++;
      }

      // invoke conflict checker on new array
      return this.conflictChecker(diagonalArray);
    },

    // test if any major diagonals on this board contain conflicts
    // I: none
    // O: boolean - true if any hasMajorDiagonalConflicts is true
    hasAnyMajorDiagonalConflicts: function() {
      // iterate through all diagonal indicies (from -n + 1 to n - 1)
      for (let i = -(this.get('n') - 1); i < this.get('n'); i ++) {
        // if hasMajDiag with values is true
        if (this.hasMajorDiagonalConflictAt(i)) {
          // return true
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(diagonalIndex) {
      // n - 1 variable
      let shortN = this.get('n') - 1;
      // convert diagonal index into starting matrix position, saved as a variable
      var diagonalPos = [0, shortN];
      // declare diagonal array
      let diagonalArray = [];
      if (diagonalIndex < shortN) {
        diagonalPos = [0, diagonalIndex];
      } else if (diagonalIndex > shortN) {
        diagonalPos = [diagonalIndex - (shortN), shortN];
      }
      // while loop through diagonal values from start position (stops when position is out of bounds)
      while (this._isInBounds(...diagonalPos)) {
        // push value at each point to array
        diagonalArray.push(this.valueFinder(...diagonalPos));
        // increment position (row +, col -)
        diagonalPos[0] ++;
        diagonalPos[1] --;
      }
      // invoke conflict checker on array
      return this.conflictChecker(diagonalArray);
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // iterate through all minor diag indicies (from 0 to n + 1)
      for (let i = 0; i < this.get('n') + 1; i ++) {
        // check to see diag has conflict
        if (this.hasMinorDiagonalConflictAt(i)) {
          // return true
          return true;
        }
      }
      return false;
    },

    /*
    Exclusion helpers:
    - invoked when placing a new piece, nulls out all rows/columns/diagonals threatened by new piece
      - rewrites them as null value

    */
    // ROOK EXCLUSION helper function
    // I: new piece position (rowI, colI), current board
    // O: mutates input board OR returns updated board
    // C: should NOT overwrite 1 or null values
    rookExclusion: function(currentBoard, rowI, colI) {
      // iterate through newPiece's row
      for (let i = 0; i < this.get('n'); i++) {
        // null out any 0 values
        if (currentBoard.rows()[rowI][i] === 0) {
          currentBoard.rows()[rowI][i] = null;
        }
      }
      // iterate through newPiece's column
      for (let i = 0; i < this.get('n'); i++) {
        // null out any 0 values
        if (currentBoard.rows()[i][colI] === 0) {
          currentBoard.rows()[i][colI] = null;
        }
      }
    },

    // QUEEN EXCLUSION helper function
    queenExclusion: function(currentBoard, rowI, colI) {
      var diagonalArray = [];
      var majorDiagIndex = this._getFirstRowColumnIndexForMajorDiagonalOn(rowI, colI);
      let diagonalPos = [0, 0];
      if (majorDiagIndex > 0) {
        diagonalPos = [0, majorDiagIndex];
      } else if (majorDiagIndex < 0) {
        diagonalPos = [Math.abs(majorDiagIndex), 0];
      }
      // loop through diagonal values
      while (this._isInBounds(...diagonalPos)) {
        // push starting matrix position variable into array
        diagonalArray.push([this.valueFinder(...diagonalPos), diagonalPos[0], diagonalPos[1]]);
        // increment pos
        diagonalPos[0] ++;
        diagonalPos[1] ++;
      }
      var minorDiagIndex = this._getFirstRowColumnIndexForMinorDiagonalOn(rowI, colI);
      let shortN = this.get('n') - 1;
      diagonalPos = [0, shortN];
      // declare diagonal array
      if (minorDiagIndex < shortN) {
        diagonalPos = [0, minorDiagIndex];
      } else if (minorDiagIndex > shortN) {
        diagonalPos = [minorDiagIndex - (shortN), shortN];
      }
      // while loop through diagonal values from start position (stops when position is out of bounds)
      while (this._isInBounds(...diagonalPos)) {
        // push value at each point to array
        diagonalArray.push([this.valueFinder(...diagonalPos), diagonalPos[0], diagonalPos[1]]);
        // increment position (row +, col -)
        diagonalPos[0] ++;
        diagonalPos[1] --;
      }
      console.log(diagonalArray)
      for (var i = 0; i < diagonalArray.length; i++) {
        if (diagonalArray[i][0] === 0) {
          console.log(currentBoard.rows()[diagonalArray[i][1]][diagonalArray[i][2]]);
          currentBoard.rows()[diagonalArray[i][1]][diagonalArray[i][2]] = null;
        }
      }
    }


    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());


var myBoard = new Board([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]]);