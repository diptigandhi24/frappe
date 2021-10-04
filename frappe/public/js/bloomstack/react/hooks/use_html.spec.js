import {segregateComplexSimpleProps} from "./use_html.jsx"

describe("Testing the functions of Use_html hook",()=>{

    let fakePropsData = [{
      "item": {
          "label": "Module:",
          "group": "filters",
          "index": -100,
          "meta": {
              "tag": "module:",
              "filter_by": "Module",
              "value": "module:"
          }
      }
    },
    {
      "item": {
          "label": "Doctype:",
          "group": "filters",
          "index": -99,
          "meta": {
              "tag": "doctype:",
              "filter_by": "Doctype",
              "value": "module:"
          }
      }
    },
    {
      "item": {
          "label": "Report:",
          "group": "filters",
          "index": -98,
          "meta": {
              "tag": "report:",
              "filter_by": "Report",
              "value": "module:"
          }
      },
      
    },
    {
      "item": {
          "label": "Test:",
          "group": "filters",
          "index": -96,
          "meta": {
              "tag": "test:",
              "filter_by": "Test",
              "value": "module:"
          }
      },
      
    },
  ];   
    
    test("Counting comle props",()=>{
      const simple_types = ["string", "bigint", "number", "undefined"];
      let simple_props_count = 0;
      let complex_props_count = 0;
      
      fakePropsData.map((obj) =>{ 
        const [simple_props, complex_props] = Object.entries(obj).reduce(segregateComplexSimpleProps, [{}, {}]);
        console.log("lengths",Object.keys( simple_props).length,Object.keys(complex_props_count).length )
        if(Object.keys( simple_props).length !== 0){
            simple_props_count ++;
        }
        if(Object.keys(complex_props).length !== 0){
          complex_props_count++;
        }
        })
        
      expect(complex_props_count).toBe(4);
    })

        
    
    
});


