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
    
    test("Counting simle and complex props after segregating",()=>{

      let simple_props_count = 0;
      let complex_props_count = 0;
      
      fakePropsData.map((obj) =>{ 

        const [simple_props, complex_props] = segregateComplexSimpleProps(obj);
        simple_props_count = Object.keys(simple_props).length;
        complex_props_count = complex_props_count + Object.keys(complex_props).length;
        
        })
        
      expect(complex_props_count).toBe(4);
    })

        
    
    
});


