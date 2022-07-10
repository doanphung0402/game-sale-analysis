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

  // const csvUrl = 'https://gist.githubusercontent.com/evarun22/39d2fdb26f358c0171aa87b989b4d816/raw/e52963e5791313311781b8e42e4623280d6d1754/vgsales.csv';
   const csvUrl ='https://gist.githubusercontent.com/doanphung0402/42b93451cd07d87ba113961b44b7d13f/raw/2a61721575390fea355f03c35564aa00e991bb94/game-sale-analysis-data.csv'; 

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
    
  const run$1 = async () => {
      const data  = await totalOtherSales(); 
      const marks = SalePerYear
        .data(data)
      //   .width(window.innerWidth)
        .width(1000)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);
      const d =document.getElementById("saleperyear"); 
      d.replaceWith(await marks.render(),d); 
    };
      
    run$1();

  const formatGlobalSale = (Global_Sales) =>{ 
      const pos = Global_Sales.indexOf("\t"); 
      if(pos==-1){
           return Global_Sales; 
      }else {
           return Global_Sales.slice(0,pos); 
      }
  };
  const findPublisher = (publisherName,PublisherSale) =>{
      let flag = -1 ; 
      if(PublisherSale.length ==0){
           return -1 ; 
      }
      PublisherSale.forEach((publisher,index)=>{
          if(publisher.Publisher == publisherName){
               flag =  index ; 
          }
      });
      
      return flag ; 
  };
  const findPublisherForYear = (publisherName,PublisherSale,Year) =>{
      let flag = -1 ; 
      if(PublisherSale.length ==0){
           return -1 ; 
      }
      PublisherSale.forEach((publisher,index)=>{
          if(publisher.Publisher == publisherName && publisher.Year == Year){
               flag =  index ; 
          }
      });
      
      return flag ; 
  };
  //tong doanh thu cua cac publisher 
  const totalPublisherGlobalSale = async() =>{
      const data = await getData(); 
      let PublisherSale =[]; 
      data.forEach(data1=>{
          let resFind = findPublisher(data1.Publisher,PublisherSale) ; 
          if(resFind != -1){
              PublisherSale[resFind].Global_Sales =(Number(PublisherSale[resFind].Global_Sales)+
                Number(data1.Global_Sales)).toString(); 
          }else {
               PublisherSale.push({
                    "Publisher" : data1.Publisher, 
                    "Global_Sales":formatGlobalSale(data1.Global_Sales)
               }); 

          }
      }); 
       PublisherSale.sort((a,b)=> {
           return b.Global_Sales -a.Global_Sales 
       });
      
      return PublisherSale;
        
  };
  //tong doanh thu cac nha phat trien qua  cac nam 
  const totalGlobalSalesPublisherPerYear = async()=>{
      const data = await getData(); 
      let PublisherSale =[]; 
      data.forEach(data1=>{
          let resFind = findPublisherForYear(data1.Publisher,PublisherSale,data1.Year) ; 
          if(resFind != -1){
              PublisherSale[resFind].Global_Sales =(Number(PublisherSale[resFind].Global_Sales)+
                Number(data1.Global_Sales)).toString(); 
          }else {
               PublisherSale.push({
                    "Publisher" : data1.Publisher, 
                    "Global_Sales": formatGlobalSale(data1.Global_Sales), 
                    "Year" : data1.Year
               }); 

          }
      }); 
          return PublisherSale ; 
  };
  //doanh thu cua top 5 publisher qua cac nam 
  const topPublisherBestSaleGlobalPerYear = async(top) =>{
       const data = await totalGlobalSalesPublisherPerYear(); 
       await totalPublisherGlobalSale();
       const topPublisherBestSaleGlobal = await (await totalPublisherGlobalSale()).slice(0,top).map(item=>{
           return item.Publisher ; 
       }); 
      
       return data.filter(item=>{
           if(topPublisherBestSaleGlobal.includes(item.Publisher)){
               return item ; 
           }
       })   
  };

  const PublisherSale  = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year'),
      vl__default["default"].y().fieldQ('Global_Sales').scale({ zero: false }), 
      vl__default["default"].color().fieldN('Publisher'), 
      vl__default["default"].tooltip().fieldN('Publisher','Global_Sales')
    );
    
  const run = async () => {
      const data  = await topPublisherBestSaleGlobalPerYear(5);
      console.log("🚀 ~ file: PublisherSale.js ~ line 18 ~ run ~ data", data);
      const marks = PublisherSale
        .data(data)
        // .width(window.innerWidth)
        
        .width(1000)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);
      
      let d = document.getElementById("top5saleperyear"); 
      d.replaceWith(await marks.render(),d); 
      // document.body.appendChild(await marks.render()); 
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
