import { AutoCompleteItem } from "./auto_complete_item"

export const AutoCompleteGroup = ({rows}) => {
  return <li class="group">
    <ul>
    { rows && rows.map((r, i) => <AutoCompleteItem key={i} row={r} />) }
    </ul>
  </li>
}