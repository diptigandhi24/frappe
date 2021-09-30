const segregateComplexSimpleProps = require("./use_html_helperFunctions")

describe("Testing the functions of Use_html hook",()=>{

    // let fakePropsData = [
    //     {
    //         "item": {
    //             "label": "Module:",
    //             "group": "filters",
    //             "index": -100,
    //             "meta": {
    //                 "tag": "module:",
    //                 "filter_by": "Module",
    //                 "value": "module:"
    //             },
    //             "on_select": ƒ ()
    //         }
    //     },{           
    //             "item": {
    //                 "label": "Report:",
    //                 "group": "filters",
    //                 "index": -98,
    //                 "meta": {
    //                     "tag": "report:",
    //                     "filter_by": "Report",
    //                     "value": "module:"
    //                 },            
    //                 "on_select": ƒ ()
    //             }
    //         },{            
    //                 "item": {
    //                     "label": "Doctype:",
    //                     "group": "filters",
    //                     "index": -99,
    //                     "meta": {
    //                         "tag": "doctype:",
    //                         "filter_by": "Doctype",
    //                         "value": "module:"
    //                     },            
    //                     "on_select": ƒ ()
    //                 }
    //         }
        
    
    // ]
    test("testing the propsCount",()=>{
        let simple_props_count = 0;
      let complex_props_count = 0;
        // fakePropsData.map((obj) =>{ 
        //     const [simple_props, complex_props] =  Object.entries(obj).reduce(segregateComplexSimpleProps, [{}, {}])
        // })
        expect(complex_props_count).toBe(3);
    })
    
});
