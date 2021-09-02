export const AutoCompleteItem = ({row}) => {
  return <li onClick={() => row.on_select(row)}>{row.label}</li>
}