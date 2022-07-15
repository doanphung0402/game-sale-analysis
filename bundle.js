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
   const csvUrl ='https://gist.githubusercontent.com/doanphung0402/42b93451cd07d87ba113961b44b7d13f/raw/71a5eed9a2cc3782d3fc2b6c65299828c2b21f34/game-sale-analysis-data.csv'; 

  const getData = async () => {
    const data = await d3.csv(csvUrl);
    console.log("🚀 ~ file: getData.js ~ line 8 ~ getData ~ data", data[0]);
    
    // Have a look at the attributes available in the console!
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
               "Global_Sales" : parseFloat(globalSale.toString()).toFixed(2) 
          });
          
      }
      return newData ; 
     

  };


  const SalePerYearLine = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false}).title(null),
      vl__default["default"].y().fieldQ('Global_Sales').scale({ zero: false })

      // vl.color().fieldQ('Global_Sales').scale({zero :false})
      // vl.tooltip().fieldN('Genre')
    );
  const SalePerYearPoint = vl__default["default"] 
    .markPoint()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false} ),
      vl__default["default"].y().fieldQ('Global_Sales').scale({ zero: false }), 
      vl__default["default"].tooltip(['Global_Sales'])
    );
    // export const SalePerYear = vl
  const run$9 = async () => {
      const data  = await totalOtherSales(); 
      const marksLine  = SalePerYearLine
        .data(data)
      //   .width(window.innerWidth)
        .width(1000)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);

      const marksPoint = SalePerYearPoint
         .data(data)
         .width(1000)
         .height(300)
         .autosize({ type: 'fit', contains: 'padding' })
         .config(config);

      const d =document.getElementById("saleperyear"); 
      d.replaceWith(await vl__default["default"].layer(marksLine, marksPoint).render(),d); 
    };
      
    run$9();

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
                    "Global_Sales":parseFloat(formatGlobalSale(data1.Global_Sales)).toFixed(2) 
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
                     "EU_Sales" : data1.EU_Sales, 
                     "JP_Sales" : data1.JP_Sales, 
                     "NA_Sales" : data1.NA_Sales, 
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
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title(null),
      vl__default["default"].y().fieldQ('Global_Sales').scale({ zero: false }), 
      vl__default["default"].color().fieldN('Publisher'), 
      vl__default["default"].tooltip(['Publisher'])
    );
    
  const run$8 = async () => {
      const data  = await topPublisherBestSaleGlobalPerYear(5);
      const marks = PublisherSale
        .data(data)
        // .width(window.innerWidth)
        
        .width(1000)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);
      
      let d = document.getElementById("top5saleperyear"); 
      d.replaceWith(await marks.render(),d); 
    };
      
    run$8();

  const gameLaunchedPerYear = async() =>{
       const data = await getData(); 
       let gameLaunched = []; 
       for(let k =1980 ;k<2021;k++){
         let numberGame = 0; 
         data.forEach(item=>{
               if(item.Year == k){
                  numberGame++; 
               } 
           });
           gameLaunched.push({
              "Year" : k.toString(), 
              "number_game" : numberGame.toString()
          });
       }
       return gameLaunched; 
  };
  const gameLaunchedPerYearLine  = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title(null),
      vl__default["default"].y().fieldQ('number_game').scale({ zero: false }), 
    );
  const gameLaunchedPerYearPoint = vl__default["default"]
     .markPoint()
     .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title(null),
      vl__default["default"].y().fieldQ('number_game').scale({ zero: false }), 
      vl__default["default"].tooltip(['number_game'])
     );
  const run$7 = async () => {
      const data  = await gameLaunchedPerYear();
      const marksLine  = gameLaunchedPerYearLine
        .data(data)
        // .width(window.innerWidth)
        
        .width(1000)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);
      const markPoint = gameLaunchedPerYearPoint
         .data(data)
         .width(1000)
         .height(300)
         .autosize({ type: 'fit', contains: 'padding' })
         .config(config);

      let d = document.getElementById("gameLaunchedPerYear"); 
      d.replaceWith(await vl__default["default"].layer(marksLine,markPoint).render(),d); 
    };
      
    run$7();

  const getSaleJapanPerYear = async()=> { 
       const data =await getData();
       let saleGameJp = []; 
      for (let k =1983;k<2018;k++){
          let totalSaleInYear = 0; 
          data.forEach(item => {
               if(item.Year == k){
                   totalSaleInYear += Number(item.JP_Sales); 
               }
          });
          saleGameJp.push({
               'Year' : k.toString(), 
               'Sale' : totalSaleInYear.toString()
          });
         
      }
      return saleGameJp ; 
        
      };
      const getSaleEuPerYear = async()=> { 
        const data =await getData();
        let saleGameEu = []; 
       for (let k =1983;k<2018;k++){
           let totalSaleInYear = 0; 
           data.forEach(item => {
                if(item.Year == k){
                    totalSaleInYear += Number(item.EU_Sales); 
                }
           });
           saleGameEu.push({
                'Year' : k.toString(), 
                'Sale' : totalSaleInYear.toString()
           });
          
       }
       return saleGameEu ;
       };

  const SaleJapanPerYear = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title("Thị trường Nhật Bản"),
      vl__default["default"].y().fieldQ('Sale').scale({ zero: false }).title("million dollar")
    );

  const SaleEUPerYear = vl__default["default"]
    .markLine()
     .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title("Thị trường Châu Âu"),
      vl__default["default"].y().fieldQ('Sale').scale({ zero: false }).title("million dollar")
     ); 
  const run$6 = async () => { 
      const dataJp  = await getSaleJapanPerYear(); 
      const dataEu = await getSaleEuPerYear();
    
      const marksJp = SaleJapanPerYear
      .data(dataJp)
        // .width(window.innerWidth)
        
        .width(600)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);
      
        const markEu = SaleEUPerYear
        .data(dataEu)
          // .width(window.innerWidth)
          
          .width(600)
          .height(300)
          .autosize({ type: 'fit', contains: 'padding' })
          .config(config);


      let d = document.getElementById("SaleJapanPerYear"); 
      d.replaceWith(await vl__default["default"].hconcat(marksJp,markEu).render(),d); 
    };
      
    run$6();

  const findPlatform =(flatformName,flatformArr,Year) =>{
      let pos =-1;  
      if(flatformArr.length == 0){
           return pos ; 
      }
       flatformArr.forEach((flatform,index)=>{
          if(flatform.Platform_name == flatformName && flatform.Year == Year ){
               pos = index ; 
          }
       });
       return pos ; 
  };
  const getNumberGameOfPlatformPerYear =async()=>{
       const data =await getData(); 
       let numberGameofPlatformPerYear=[]; 
     
           data.forEach(item=>{
              let pos = findPlatform(item.Platform,numberGameofPlatformPerYear,item.Year); 
               if(pos == -1 ){
                   numberGameofPlatformPerYear.push({
                       'Year' :item.Year , 
                       'Platform_name' : item.Platform , 
                       'number_game' : "1"
                   });
               }else {

                  let number_game1 =Number(numberGameofPlatformPerYear[pos].number_game) + 1 ; 
                   numberGameofPlatformPerYear[pos] = {
                    'Year' : item.Year, 
                    'Platform_name' : item.Platform , 
                    'number_game' : number_game1.toString()
                   };
               }
           });
           return numberGameofPlatformPerYear ; 
       };
     


  const findFlatform1 = (PlatformName , PlatformArr)=>{
    let pos =-1 ; 
     if(PlatformArr.length ==0){
       return pos; 
     }else {
       PlatformArr.forEach((item,index)=>{
         if(item.Platform_name==PlatformName){
            pos = index ; 
         }
       });
     }
     return pos ; 
  };
  const numberGameOf5Platform =(data)=>{
      let numberGameOf5Platform = []; 
      data.forEach((item,index) =>{
        let pos = findFlatform1(item.Platform_name,numberGameOf5Platform) ; 
         if(pos ==-1){
           numberGameOf5Platform.push({
             'Platform_name' : item.Platform_name , 
             'number_game' : item.number_game 
           });
         }else {
          let number_game =  Number(numberGameOf5Platform[pos].number_game) + Number(item.number_game); 
           numberGameOf5Platform[pos] = {
             ...numberGameOf5Platform[pos], 
             'number_game' : number_game.toString(), 
           };
         }
      });
      return numberGameOf5Platform.sort((a,b)=>{
         return  Number(b.number_game) - Number(a.number_game); 
      }).slice(0,5).map(item=>{
         return item.Platform_name; 
      }); 
  };


  const gameOfPlatformPerYear  = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title(null),
      vl__default["default"].y().fieldQ('number_game').scale({ zero: false }).title("game number"), 
      vl__default["default"].color().fieldN('Platform_name').title("platform"), 
      // vl.opacity().if(selection, vl.value(0.75)).value(0.05)
      vl__default["default"].tooltip(["Platform_name"])
    );
    
  const run$5 = async () => {

      const data1  = await getNumberGameOfPlatformPerYear(); 
      console.log("🚀 ~ file: gameOfPlatformPerYear.js ~ line 93 ~ run ~ data1", data1);
      const data2 =  numberGameOf5Platform(data1); 
      console.log("🚀 ~ file: gameOfPlatformPerYear.js ~ line 96 ~ run ~ data2", data2);
      const data = data1.filter(item=>{
          return data2.includes(item.Platform_name)
      });
      console.log("🚀 ~ file: gameOfPlatformPerYear.js ~ line 100 ~ run ~ data", data);
      const marks = gameOfPlatformPerYear
        .data(data)
        // .width(window.innerWidth)
        
        .width(1200)
        .height(500)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);
      
      let d = document.getElementById("gameOfPlatformPerYear"); 
      d.replaceWith(await marks.render(),d); 
    };
      
    run$5();

  // const findPf = (Year,SaleGameInDSArr) =>{
  //      let pos = -1 ; 
  //      if(SaleGameInDSArr.length ==0){
  //          return pos ; 
  //      }else{
  //         SaleGameInDSArr.forEach((item,index) => {
  //             if(item.Year == Year){
  //                  pos = index; 
  //             }
  //         });
  //      }
  //     return pos ; 
  // }
  const SaleGameNitendo  = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title("Các thị trường khác "),
      vl__default["default"].y().fieldQ('NA_Sales').scale({ zero: false })
    );
    const SaleJpNitendo = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title("Thị trường Nhật"),
      vl__default["default"].y().fieldQ('JP_Sales').scale({ zero: false })
    );
    const SaleEuNitendo = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title("Thị trường Châu Âu"),
      vl__default["default"].y().fieldQ('EU_Sales').scale({ zero: false })
    );
  const run$4 = async () => {
      const data  = await topPublisherBestSaleGlobalPerYear(1);
      console.log("🚀 ~ file: SaleGameNitendo.js ~ line 28 ~ run ~ data", data);
      const marksSaleEu = SaleEuNitendo
      .data(data)
      // .width(window.innerWidth)
      
      .width(300)
      .height(200)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);

      const marksSaleJp = SaleJpNitendo
      .data(data)
      // .width(window.innerWidth)
      
      .width(300)
      .height(200)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);
      const marksSaleGlobal = SaleGameNitendo
        .data(data)
        // .width(window.innerWidth)
        
        .width(300)
        .height(200)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);
      
      let d = document.getElementById("SaleGameNitendo"); 
      d.replaceWith(await vl__default["default"].hconcat(marksSaleEu,marksSaleJp,marksSaleGlobal).render(),d); 
    };
      
    run$4();

  const findGame$2 =(genre,Year,genreGame)=>{ 
        let pos = -1 ; 
        if(genreGame.length ==0 ){
          return pos ; 
        }
        genreGame.forEach((item,index) => {
            if(item.Genre == genre && item.Year==Year){
               pos = index ; 
            }
        });
        return pos ; 
  };

  const genreGamePerYear$1 = async()=>{
      const data = await getData(); 
      let genreGame =[]; 
      
          data.forEach(item=>{
              let pos = findGame$2(item.Genre,item.Year,genreGame); 
              if(pos ==-1){
                   genreGame.push({
                       'Genre' : item.Genre , 
                       'Year' :item.Year, 
                       'game_number' : '1'
                   });
              }else {
                   genreGame[pos] = {
                           ...genreGame[pos], 
                          'game_number' : ((Number(genreGame[pos].game_number))+1).toString()
                   };
              }
          });
      

      return genreGame ; 
     

  };


  const genreGamePerYearLine = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false}).title(null),
      vl__default["default"].y().fieldQ('game_number').scale({ zero: false }),
      vl__default["default"].color().fieldN('Genre'), 
      vl__default["default"].tooltip(['Genre'])
      // vl.color().fieGenreldQ('Global_Sales').scale({zero :false})
      // vl.tooltip().fieldN('Genre')
    );
  const genreGamePerYearPoint = vl__default["default"] 
    .markPoint()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false}).title(null),
      vl__default["default"].y().fieldQ('game_number').scale({ zero: false }), 
      vl__default["default"].tooltip(['game_number'])
    );
    // export const SalePerYear = vl
  const run$3 = async () => {
      const data  =await genreGamePerYear$1();
      const marksLine  = genreGamePerYearLine
        .data(data)
      //   .width(window.innerWidth)
        .width(1000)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);

      genreGamePerYearPoint
         .data(data)
         .width(1000)
         .height(300)
         .autosize({ type: 'fit', contains: 'padding' })
         .config(config);

      const d =document.getElementById("genreGamePerYear"); 
      d.replaceWith(await vl__default["default"].layer(marksLine).render(),d); 
    };
      
    run$3();

  const findGame$1 =(genre,Year,genreGame)=>{ 
        let pos = -1 ; 
        if(genreGame.length ==0 ){
          return pos ; 
        }
        genreGame.forEach((item,index) => {
            if(item.Genre == genre && item.Year==Year){
               pos = index ; 
            }
        });
        return pos ; 
  };

  const genreGamePerYear = async()=>{
      const data = await getData(); 
      let genreGame =[]; 
       
     
         
          data.forEach(item=>{
              let pos = findGame$1(item.Genre,item.Year,genreGame); 
              if(pos ==-1){
                   genreGame.push({
                       'Genre' : item.Genre, 
                       'Year' :item.Year, 
                       'game_number' : '1', 
                       'Global_Sales': formatGlobalSale(item.Global_Sales)
                   });
              }else {
                let Global_Sales =  Number(genreGame[pos].Global_Sales) + Number(formatGlobalSale(item.Global_Sales)); 
                   genreGame[pos] = {
                       ...genreGame[pos], 
                          'game_number' : (Number(genreGame[pos].game_number)+1).toString(), 
                          'Global_Sales' : Global_Sales.toString()
                   };
              }
          });
      

      return genreGame ; 
     

  };


  const ActionGamePerYearLine = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false}).title(null),
      vl__default["default"].y().fieldQ('game_number').scale({ zero: false })
      // vl.color().fieGenreldQ('Global_Sales').scale({zero :false})
      // vl.tooltip().fieldN('Genre')
    );
  const ActionGamePerYearPoint = vl__default["default"] 
    .markPoint()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false}).title(null),
      vl__default["default"].y().fieldQ('game_number').scale({ zero: false }), 
      vl__default["default"].tooltip(['game_number'])
    );
    const ActionGameSaleGlobal = vl__default["default"]
      .markLine()
      .encode(
         vl__default["default"].x().fieldT('Year').scale({zero :false}), 
         vl__default["default"].y().fieldQ('Global_Sales').scale({zero : false})
      );
    // export const SalePerYear = vl
  const run$2 = async () => {
      const data  =await (await genreGamePerYear()).filter(item=>{
           return item.Genre =='Action'
      });
      
      const marksLineGlobalSale = ActionGameSaleGlobal
      .data(data)
    //   .width(window.innerWidth)
      .width(500)
      .height(300)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);

      const marksLine  = ActionGamePerYearLine
        .data(data)
      //   .width(window.innerWidth)
        .width(500)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);

      const marksPoint = ActionGamePerYearPoint
         .data(data)
         .width(500)
         .height(300)
         .autosize({ type: 'fit', contains: 'padding' })
         .config(config);

      const d =document.getElementById("actionGamePerYear"); 
      d.replaceWith(await vl__default["default"].hconcat( vl__default["default"].layer(marksLine,marksPoint),marksLineGlobalSale).render(),d); 
    };
      
    run$2();

  const findGame= (publisher_name,Year,gameOfPubArr)=>{
      let pos =-1; 
      if(gameOfPubArr.length==0){
           return pos ; 
      }else {
           gameOfPubArr.forEach((item,index)=>{
               if (item.Publisher == publisher_name && Year==item.Year){
                   pos = index ; 
               }
           });
      }
       return pos ; 
  };

  const getGameOfPublisher = async()=>{
      const data = await getData(); 
      let newData =[]; 
      
      data.forEach(item=>{
          let pos = findGame(item.Publisher,item.Year,newData) ; 
          if(pos ==-1){
               newData.push({
                  'Publisher' : item.Publisher , 
                  'Year' : item.Year, 
                  'game_number' : '1' 
               });
          }else {
               newData[pos] = {
                   ...newData[pos], 
                   'game_number': (Number(newData[pos].game_number)+1).toString()
               };
          }
      });
      return newData ; 
     

  };


  const gameOfPublisherPerYearLine = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false}).title(null),
      vl__default["default"].y().fieldQ('game_number').scale({ zero: false }), 

      vl__default["default"].color().fieldN('Publisher').scale({zero :false})
      // vl.tooltip().fieldN('Genre')
    );

    // export const SalePerYear = vl
  const run$1 = async () => {
      const data  = await (await getGameOfPublisher()).filter(item=>{
          let Pub = item.Publisher ; 
           if(Pub=="Activision" || Pub=="Electronic Arts"||Pub=="Ubisoft" || Pub =="Namco Bandai Games" || Pub =="Konami Digital Entertainment"){
             if(item.Year <= 2020){
               return true ; 
             }
           }
      }); 
      console.log("🚀 ~ file: gameOfPublisherPerYear.js ~ line 57 ~ run ~ data", data);
      const marksLine  = gameOfPublisherPerYearLine
        .data(data)
      //   .width(window.innerWidth)
        .width(1000)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);

      const d =document.getElementById("gameOfPublisherPerYear"); 
      d.replaceWith(await vl__default["default"].layer(marksLine).render(),d); 
    };
      
    run$1();

  const getNASale = async()=> { 
       const data =await getData();
       let saleGameJp = []; 
      for (let k =1983;k<2018;k++){
          let totalSaleInYear = 0; 
          data.forEach(item => {
               if(item.Year == k){
                   totalSaleInYear += Number(item.NA_Sales); 
               }
          });
          saleGameJp.push({
               'Year' : k.toString(), 
               'Sale' : totalSaleInYear.toString()
          });
         
      }
      return saleGameJp ; 
        
      };
      const getOtherSalePerYear = async()=> { 
        const data =await getData();
        let saleGameEu = []; 
       for (let k =1983;k<2018;k++){
           let totalSaleInYear = 0; 
           data.forEach(item => {
                if(item.Year == k){
                    totalSaleInYear += Number(item.Other_Sales); 
                }
           });
           saleGameEu.push({
                'Year' : k.toString(), 
                'Sale' : totalSaleInYear.toString()
           });
          
       }
       return saleGameEu ;
       };

  const SaleNAPerYear = vl__default["default"]
    .markLine()
    .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title("Thị trường Bắc Mỹ "),
      vl__default["default"].y().fieldQ('Sale').scale({ zero: false }).title("million dollar")
    );

  const SaleOtherPerYear = vl__default["default"]
    .markLine()
     .encode(
      vl__default["default"].x().fieldT('Year').scale({ zero: false }).title("Các thị trường khác "),
      vl__default["default"].y().fieldQ('Sale').scale({ zero: false }).title("million dollar")
     ); 
  const run = async () => { 
      const dataNA  = await getNASale(); 
      const dataOther = await getOtherSalePerYear();
    
      const marksNA = SaleNAPerYear
      .data(dataNA)
        // .width(window.innerWidth)
        
        .width(600)
        .height(300)
        .autosize({ type: 'fit', contains: 'padding' })
        .config(config);
      
        const markOther = SaleOtherPerYear
        .data(dataOther)
          // .width(window.innerWidth)
          
          .width(600)
          .height(300)
          .autosize({ type: 'fit', contains: 'padding' })
          .config(config);


      let d = document.getElementById("SaleNaAndOtherPerYear"); 
      d.replaceWith(await vl__default["default"].hconcat(marksNA,markOther).render(),d); 
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
