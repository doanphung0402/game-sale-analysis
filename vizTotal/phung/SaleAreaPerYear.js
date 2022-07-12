import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';
import * as UtilsFunction from './UtilsFunction'


const getSaleJapanPerYear = async()=> { 
     const data =await getData();
     let saleGameJp = []; 
    for (let k =1983;k<2018;k++){
        let totalSaleInYear = 0; 
        data.forEach(item => {
             if(item.Year == k){
                 totalSaleInYear += Number(item.JP_Sales); 
             }
        })
        saleGameJp.push({
             'Year' : k.toString(), 
             'Sale' : totalSaleInYear.toString()
        })
       
    }
    return saleGameJp ; 
      
    }
    const getSaleEuPerYear = async()=> { 
      const data =await getData();
      let saleGameEu = []; 
     for (let k =1983;k<2018;k++){
         let totalSaleInYear = 0; 
         data.forEach(item => {
              if(item.Year == k){
                  totalSaleInYear += Number(item.EU_Sales); 
              }
         })
         saleGameEu.push({
              'Year' : k.toString(), 
              'Sale' : totalSaleInYear.toString()
         })
        
     }
     return saleGameEu ;
     }

export const SaleJapanPerYear = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title(null),
    vl.y().fieldQ('Sale').scale({ zero: false }).title("Japan_Sales")
  )

const SaleEUPerYear = vl
  .markLine()
   .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title(null),
    vl.y().fieldQ('Sale').scale({ zero: false }).title("EU_Sales")
   ) 
const run = async () => { 
    const dataJp  = await getSaleJapanPerYear(); 
    const dataEu = await getSaleEuPerYear()
  
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
    d.replaceWith(await vl.hconcat(marksJp,markEu).render(),d); 
  };
    
  run(); 