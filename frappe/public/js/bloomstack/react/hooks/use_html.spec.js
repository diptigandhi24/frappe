import { segregateComplexSimpleProps } from "./use_html.jsx"

describe("Testing the functions of Use_html hook", () => {

  // test combinations broken into simple and complex
  const simple = { simple1: 1, simple2: "simple" };
  const complex = { complex1: {}, complex2: [] };

  test("counting simple and complex props", () => {

    const testSimpleComplex = { ...simple, ...complex }
    const [test1_simple_props, test1_complex_props] = segregateComplexSimpleProps(testSimpleComplex);
    expect(test1_simple_props).toMatchObject(simple);
    expect(test1_complex_props).toMatchObject(complex)
  })

  test("counting complex props only", () => {
    const test2_complex_props = { ...complex };
    const [test_simple_props, test_complex_props] = segregateComplexSimpleProps(test2_complex_props);
    expect(test_simple_props).toMatchObject({});
    expect(test_complex_props).toMatchObject(test2_complex_props)
  })

  test("counting simple props only", () => {
    const test3_simple_props = { ...simple };
    const [test_simple_props, test_complex_props] = segregateComplexSimpleProps(test3_simple_props);
    expect(test_simple_props).toMatchObject(test3_simple_props);
    expect(test_complex_props).toMatchObject({})
  })

});


