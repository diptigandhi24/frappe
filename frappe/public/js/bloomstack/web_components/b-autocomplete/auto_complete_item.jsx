export const AutoCompleteItem = ({row, renderer}) => {
  if ( renderer ) {
    return renderer(row);
  }
  
  return <li onClick={() => row.on_select(row)}>{row.label}</li>
}