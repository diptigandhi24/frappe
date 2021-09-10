export const not_null = (items) => {
  return items.reduce((p, c) => {
    if ( c != null ) {
      p.push(c);
    }
    return p;
  }, []);
}