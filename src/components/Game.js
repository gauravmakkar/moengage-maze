import React, { Component } from 'react'
import { MARIO } from './../constants'
import Board from './Board'
import Cell from './Cell'
import util from './../utils'

class Game extends Component {
  constructor () {
    super()
    this.state = {
      width: 0,
      height: 0,
      moves: 0
    }
    this.inputChanged = this.inputChanged.bind(this)
    this.toggleDisplay = this.toggleDisplay.bind(this)
    this.startGame = this.startGame.bind(this)
    this.movePlayer = this.movePlayer.bind(this)
  }

  /**
   * The method will reset the game board.
   */
  toggleDisplay () {
    const {
      gameStart
    } = this.state

    this.setState({
      gameStart: !gameStart
    })
  }

  /**
   * the method sets the value of height and width of the board.
   * @param property
   * @returns {function(*)}
   */
  inputChanged (property) {
    return (e) => {
      const val = e.target.value
      const newData = {}
      newData[property] = +val
      this.setState(newData)
    }
  }

  /**
   * The method will calculate the position
   * of mario and moves it to the desired position.
   * @param e
   */
  handleKeyDown = (e) => {
    let position

    switch (e.keyCode) {
      case 37:
        position = {x: -1, y: 0}
        break
      case 38:
        position = {x: 0, y: -1}
        break
      case 39:
        position = {x: 1, y: 0}
        break
      case 40:
        position = {x: 0, y: 1}
        break
      default:
        return
    }

    this.movePlayer(position)
  }

  movePlayer (position) {
    let {
      playerCell,
      moves,
      game,
      mushrooms
    } = this.state

    if (mushrooms === 0) {
      alert(`Game over, you completed the game in ${moves} moves`)
      return
    }

    const newMove = {
      x: playerCell.x + position.y,
      y: playerCell.y + position.x
    }

    const nextCell = util.getCellByCoord(game.cells, newMove)

    if (!nextCell) {
      return
    }

    if (nextCell.value === 'mushroom') {
      mushrooms--
    }
    nextCell.value = 'player'
    playerCell.value = null
    moves++
    const newCells = util.findAndReplaceCell(util.findAndReplaceCell(game.cells, nextCell), playerCell)
    if (mushrooms === 0) {
      alert(`Game over, Total moves to save princess: ${moves}`)
    }
    this.setState({
      game: {
        cells: newCells
      },
      playerCell: nextCell,
      moves,
      mushrooms
    })
  }

  /**
   * The method will start/restart the game
   */
  startGame () {
    const {width, height, gameStart} = this.state
    const dimension = width * height
    const longList = Array.apply(null, {length: dimension}, [Number.call, Number])
    const game = util.arrayToBoard(longList, width, height)
    const currentPlayerCell = util.getPlayerCell(game.cells)
    const mushroomCells = util.getMushroomCells(game.cells)
    this.setState({
      dimension,
      game,
      moves: 0,
      playerCell: currentPlayerCell,
      mushrooms: mushroomCells.length
    })

    if (!gameStart) { this.toggleDisplay() }

  }

  render () {
    const {
      gameStart,
      moves,
      mushrooms,
      width,
      height
    } = this.state

    return (
      <div className="App">
        {!gameStart &&
        (
          <div>
            <header className="App-header">
              <img src={MARIO} className="App-logo" alt="logo"/>
            </header>
            <label>Board Width</label>
            <input className='inputbox' type="number" placeholder="Width" onChange={this.inputChanged('width')}/>
            <label>Height</label>
            <input className='inputbox' onChange={this.inputChanged('height')} type="number" placeholder="Height"/>
            <button
              className='button'
              disabled={!this.state.width || !this.state.height}
              onClick={this.startGame}>
              Start Game
            </button>
          </div>
        )
        }
        {gameStart &&
        (
          <Board>
            <table style={{margin: '0 auto'}}>
              <tbody>
              {this.state.game.cells.map(function (row, i) {
                return (
                  <tr key={i}>
                    {row.map(function (cell, i) {
                      return <Cell key={i} cell={cell} size={25}/>
                    })}
                  </tr>
                )
              })}
              </tbody>
            </table>
            <h4>Moves: {moves} </h4>
            <h4>Remaining : {mushrooms} </h4>
            <h4>Board Dimension: {width} X {height} </h4>
            <button className='button' onClick={this.startGame}> Restart Game</button>
            <button className='button' onClick={this.toggleDisplay}> Reset Game Board</button>
          </Board>
        )
        }
      </div>
    )
  }

  componentDidMount () {
    window.onkeydown = this.handleKeyDown
  }
}

export default Game
