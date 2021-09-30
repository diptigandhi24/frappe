function segregateComplexSimpleProps(p, c){
    const [simple, complex] = p;
    const [key, value] = c;
    if (simple_types.includes(typeof value)) {
      simple_props_count++;
      Reflect.set(simple, key, value);
    } else {
      complex_props_count++;
      Reflect.set(complex, key, value);
    }        
    return p;
  }

module.exports =  segregateComplexSimpleProps;