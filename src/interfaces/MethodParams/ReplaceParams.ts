import { BoxType } from '../../types/BoxType'
import GetParams from './GetParams'

export default interface ReplaceParams {
  get: GetParams
  to: BoxType
}
