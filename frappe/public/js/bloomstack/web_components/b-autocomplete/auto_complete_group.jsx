import { AutoCompleteItem } from "./auto_complete_item"
import { not_null } from "../../reducers"

export const AutoCompleteGroup = ({rows, renderer}) => {
  
  return <li class="group">
    <ul>
    { rows && not_null(rows).map((r, i) => <AutoCompleteItem key={i} row={r} renderer={renderer} />) }
    </ul>
  </li>
}