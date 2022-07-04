(function (vega, vegaLite, vl, vegaTooltip, d3) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var vega__default = /*#__PURE__*/_interopDefaultLegacy(vega);
  var vegaLite__default = /*#__PURE__*/_interopDefaultLegacy(vegaLite);
  var vl__default = /*#__PURE__*/_interopDefaultLegacy(vl);

  // Appearance customization to improve readability.
  // See https://vega.github.io/vega-lite/docs/
  const dark = '#3e3c38';
  const config = {
    axis: {
      domain: false,
      tickColor: 'lightGray'
    },
    style: {
      "guide-label": {
        fontSize: 20,
        fill: dark
      },
      "guide-title": {
        fontSize: 30,
        fill: dark
      }
    }
  };

  const csvUrl = 'https://gist.githubusercontent.com/doanphung0402/a4e494863b30f45d7381cc9bed4f6b8b/raw/2a2c3d94c182c791d3cf5fb906bfdd25013301a8/game-sale-analysis-data';
  //cors
  const getData = async () => {
    const data = await d3.csv(csvUrl);
    
    // Have a look at the attributes available in the console!
    console.log(data[0]);

    return data;
  };

  vl__default["default"]
    .markBar({ size: 10, opacity: 1 })
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }),
      vl__default["default"].y().fieldQ('Global_Sales').scale({ zero: false }),
      vl__default["default"].color().fieldN('Genre'),
      vl__default["default"].tooltip().fieldN('Genre')
    );

  const totalOtherSales = async()=>{
      const data = await getData(); 
      let newData =[]; 
      for(let k = 1980 ; k<=2020 ;k++){
          let globalSale =0; 
          data.forEach((data)=>{
               if(data.Year == k){
                  globalSale += Number(data.Global_Sales); 
               }
          });
          newData.push({
               "Year" : k.toString() , 
               "Global_Sales" : globalSale.toString() 
          });
          
      }
      console.log("🚀 ~ file: growthCategory.js ~ line 9 ~ totalOtherSales ~ newData", newData);
      return newData ; 
     

  };


  const SalePerYear = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false} ),
      vl__default["default"].y().fieldQ('Global_Sales').scale({ zero: false })

      // vl.color().fieldQ('Global_Sales').scale({zero :false})
      // vl.tooltip().fieldN('Genre')
    );
    
  const run = async () => {
      const data  = await totalOtherSales(); 
      const marks = SalePerYear
        .data(data)
      //   .width(window.innerWidth)
        .width(1000)
        .height(500)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);

      document.body.appendChild(await marks.render()); 
    };
      
    run();

  vl__default["default"].register(vega__default["default"], vegaLite__default["default"], {
    view: { renderer: 'svg' },
    init: view => { view.tooltip(new vegaTooltip.Handler().call); }
  });

  // const run = async () => {
  //   const marks = viz
  //     .data(await getData())
  //     .width(window.innerWidth)
  //     .height(300)
  //     .autosize({ type: 'fit', contains: 'padding' })
  //     .config(config);
      
  //   document.body.appendChild(await marks.render()); 
    
  // };




  // run();

})(vega, vegaLite, vl, vegaTooltip, d3);
