import { useCallback } from "react"

export const Tag = ({label, on_close}) => {
  return <span class="tag">{label}{on_close && <button onClick={on_close}>x</button>}</span>
}