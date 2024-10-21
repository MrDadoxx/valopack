import { useCallback, useContext } from 'react'
import { GameContext } from '../contexts/GameContext'
import Player from '../classes/Player'
import Square from '../classes/Square'
import Position from '../classes/Position'
import getDamage from '../utils/getDamage'
import GameContextType from '../interfaces/GameContextType'
import useAbility from './useAbility'

export default function useBoard () {
  const context: GameContextType | undefined = useContext(GameContext)
  if (!context) throw new Error("Context doesn't have a provider!")

  const {
    setBoard,
    setSquareFrom,
    setSquareTo,
    setAction,
    setTurn,
    setEffects
  } = context
  const { handleMethod } = useAbility()

  const toggleTurn = (): void => {
    setTurn(prevTurn => {
      return prevTurn === 'ally' ? 'enemy' : 'ally'
    })
  }

  const handleEffects = (): void => {
    setEffects(prevEffects => {
      prevEffects.forEach(effect => {
        effect.turnsLeft -= 1

        if (effect.turnsLeft <= 0) {
          effect.methods.forEach(method => handleMethod(method, effect.square))
        }
      })

      return prevEffects.filter(effect => effect.turnsLeft > 0)
    })
  }

  const movePlayer = (player: Player, square: Square) => {
    setBoard(prevBoard => {
      const squareTo: Square = prevBoard.getSquare(square.position)
      const playerSquare: Square = prevBoard.getSquare(player.position)
      const movedPlayer: Player = new Player({
        ...player,
        position: new Position(square.position.x, square.position.y)
      })

      squareTo.add(movedPlayer)
      playerSquare.remove(player)

      return prevBoard
    })
  }

  const attackPlayer = (attacker: Player, target: Player) => {
    setBoard(prevBoard => {
      const damage: number = getDamage(attacker, target)
      target.setHealth(prevHealth => (prevHealth -= damage))

      if (target.isDead()) {
        const targetSquare: Square = prevBoard.getSquare(target.position)
        targetSquare.remove(target)
      }

      return prevBoard
    })
  }

  const killPlayer = (player: Player) => {
    setBoard(prevBoard => {
      const playerSquare: Square = prevBoard.getSquare(player.position)
      playerSquare.remove(player)
      return prevBoard
    })
  }

  const resetActions = useCallback(() => {
    setAction(null)
    setSquareFrom(null)
    setSquareTo(null)
  }, [setAction, setSquareFrom, setSquareTo])

  return {
    ...context,
    movePlayer,
    attackPlayer,
    killPlayer,
    resetActions,
    toggleTurn,
    handleEffects
  }
}
