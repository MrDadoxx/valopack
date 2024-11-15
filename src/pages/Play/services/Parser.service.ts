import { Team } from '../../../models/Team.ts'
import { Tag } from '../models/Tag.ts'
import { TeamOption } from '../models/TeamOption.ts'

export class Parser {
  static getParsedTeamOption (teamOption: TeamOption, turn: Team): Team {
    if (teamOption == 'opposite-team') {
      return turn == 'ally' ? 'enemy' : 'ally'
    } else if (teamOption == 'current-team') {
      return turn
    } else {
      return teamOption
    }
  }

  static getParsedTags (tags: Tag[], turn: Team): Tag[] {
    return tags.map(tag => ({
      ...tag,
      team: this.getParsedTeamOption(tag.team, turn)
    }))
  }
}