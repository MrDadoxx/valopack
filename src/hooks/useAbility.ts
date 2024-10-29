import { useContext } from 'react'
import GameContextType from '../interfaces/GameContextType'
import { GameContext } from '../contexts/GameContext'
import Ability from '../interfaces/Ability'
import Method from '../interfaces/Method'
import AddParams from '../interfaces/MethodParams/AddBoxParams'
import GetParams from '../interfaces/MethodParams/GetParams'
import Square from '../classes/Square'
import Box from '../classes/Box'
import RemoveParams from '../interfaces/MethodParams/RemoveBoxParams'
import ModifyAttributeParams from '../interfaces/MethodParams/ModifyAttributeParams'
import Player from '../classes/Player'
import TagParams from '../interfaces/MethodParams/AddTagParams'
import WaitParams from '../interfaces/MethodParams/WaitParams'
import Board from '../classes/Board'
import FadeParams from '../interfaces/MethodParams/ShowFadeParams'
import { teamColors } from '../constants/general'
import { Team } from '../types/Team'
import Tag from '../interfaces/Tag'
import getParsedTeamOption from '../utils/getParsedTeamOption'
import RemoveTagParams from '../interfaces/MethodParams/RemoveTagParams'
import AddClassParams from '../interfaces/MethodParams/AddClassParams'
import RemoveClassParams from '../interfaces/MethodParams/RemoveClassParams'

export default function useAbility () {
  const context: GameContextType | undefined = useContext(GameContext)
  if (!context) throw new Error("Context doesn't have a provider")

  const { squareFrom, board, setBoard, setEffects, turn } = context

  const applyFilters = (
    squares: Square[],
    filters: GetParams['filters']
  ): void => {
    if (!filters) return
    for (let i = squares.length - 1; i >= 0; i--) {
      const square = squares[i]
      const player: Player = square.getBox('player') as Player

      if (filters.boxTypes) {
        const hasAllBoxTypes = filters.boxTypes.every(boxType =>
          square.boxes.some(box => box.type === boxType)
        )

        if (!hasAllBoxTypes) {
          squares.splice(i, 1)
          continue
        }
      }

      if (filters.team && player) {
        const parsedTeam: Team = getParsedTeamOption(filters.team, turn)

        if (player.team !== parsedTeam) {
          squares.splice(i, 1)
          continue
        }
      }

      if (filters.tags) {
        const hasTags: boolean = square.boxes.some(box =>
          box.has(filters.tags as Tag[])
        )

        if (!hasTags) {
          squares.splice(i, 1)
          continue
        }
      }
    }
  }

  const handleAbility = (ability: Ability, squareTo: Square): void => {
    const { methods } = ability

    methods.forEach(method => {
      handleMethod(method, squareTo)
    })
  }

  const handleMethod = (method: Method, squareTo: Square): void => {
    const { type, params } = method

    if (type == 'add-box') {
      handleAddBoxMethod(params as AddParams, squareTo)
    } else if (type == 'remove-box') {
      handleRemoveBoxMethod(params as RemoveParams, squareTo)
    } else if (type == 'modify-attribute') {
      handleModifyAttributeMethod(params as ModifyAttributeParams, squareTo)
    } else if (type == 'add-tag') {
      handleAddTagMethod(params as TagParams, squareTo)
    } else if (type == 'wait') {
      handleWaitMethod(params as WaitParams, squareTo)
    } else if (type == 'show-fade') {
      handleShowFadeMethod(params as FadeParams, squareTo)
    } else if (type == 'add-class') {
      handleAddClassMethod(params as AddClassParams, squareTo)
    } else if (type == 'remove-tag') {
      handleRemoveTagMethod(params as RemoveTagParams, squareTo)
    } else if (type == 'remove-class') {
      handleRemoveClassMethod(params as RemoveClassParams, squareTo)
    }
  }

  const handleRemoveTagMethod = (params: RemoveTagParams, squareTo: Square) => {
    console.log(params, squareTo)
  }

  const handleGetMethod = (params: GetParams, squareTo: Square): Square[] => {
    const { getBy, filters, range } = params
    const squares: Square[] = []

    if (getBy === 'squareFrom' && squareFrom) {
      squares.push(squareFrom)
    } else if (getBy === 'squareTo' && squareTo) {
      squares.push(squareTo)
    } else if (getBy === 'range') {
      squares.push(...board.getSquaresInRange(squareTo.position, range ?? 1))
    } else if (getBy === 'tag') {
      squares.push(...board.grid.flat())
    } else if (getBy === 'all') {
      squares.push(...board.grid.flat())
    }

    applyFilters(squares, filters)

    return squares
  }

  const handleAddBoxMethod = (params: AddParams, squareTo: Square) => {
    const squares: Square[] = handleGetMethod(params.get, squareTo)
    const boxToAdd: Box = new Box({ type: params.boxType })

    squares.forEach(square => {
      square.addBox(boxToAdd)
    })
  }

  const handleRemoveBoxMethod = (params: RemoveParams, squareTo: Square) => {
    const squares: Square[] = handleGetMethod(params.get, squareTo)

    squares.forEach(square =>
      params.boxTypes.forEach(boxType => {
        square.removeBox(boxType)
      })
    )
  }

  const handleModifyAttributeMethod = (
    params: ModifyAttributeParams,
    squareTo: Square
  ) => {
    const squares: Square[] = handleGetMethod(params.get, squareTo)

    squares.forEach(square => {
      const player = square.getBox('player')
      if (player) {
        ;(player as Player).attributes[params.attribute] += params.amount
      }
    })
  }

  const handleAddTagMethod = (params: TagParams, squareTo: Square) => {
    const squares: Square[] = handleGetMethod(params.get, squareTo)

    squares.forEach(square =>
      square.boxes.forEach(box => {
        box.tags.push(...params.tags)
      })
    )
  }

  const handleWaitMethod = (params: WaitParams, squareTo: Square) => {
    if (params.type == 'miliseconds') {
      setTimeout(() => {
        params.methods.forEach(method => handleMethod(method, squareTo))

        setBoard(prevBoard => new Board(prevBoard.colors, [...prevBoard.grid]))
      }, params.time)
    } else {
      setEffects(prevEffects => [
        ...prevEffects,
        {
          methods: params.methods,
          turnsLeft: params.time + 1,
          square: squareTo
        }
      ])
    }
  }

  const handleShowFadeMethod = (params: FadeParams, squareTo: Square) => {
    const squares: Square[] = handleGetMethod(params.get, squareTo)
    let color: string = params.color

    if (params.color == 'current-team-color') {
      color = teamColors[turn]
    } else {
      color = turn == 'ally' ? teamColors['enemy'] : teamColors['ally']
    }

    squares.forEach(square => {
      square.addStyleProperty('--fade-color', color)
      square.addStyleProperty('--fade-duration', `${params.duration}s`)
      square.addClass('fade')

      setTimeout(() => {
        square.removeClass('fade')
      }, params.duration * 1000)
    })
  }

  const handleAddClassMethod = (params: AddClassParams, squareTo: Square) => {
    const squares: Square[] = handleGetMethod(params.get, squareTo)

    squares.forEach(square => {
      params.classNames.forEach(className => {
        square.addClass(className)
      })
    })
  }

  const handleRemoveClassMethod = (
    params: RemoveClassParams,
    squareTo: Square
  ) => {
    const squares: Square[] = handleGetMethod(params.get, squareTo)

    squares.forEach(square => {
      params.classNames.forEach(className => {
        square.removeClass(className)
      })
    })
  }

  return { ...context, handleAbility, handleMethod }
}