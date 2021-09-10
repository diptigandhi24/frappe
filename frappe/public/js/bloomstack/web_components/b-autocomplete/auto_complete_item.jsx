import { use_html } from "../../react/hooks/use_html";

export const AutoCompleteItem = ({row, renderer}) => {
  const custom_item = use_html(renderer?renderer(row):null);
  return <li onClick={() => row.on_select(row)}>{custom_item?custom_item:row.label}</li>
}