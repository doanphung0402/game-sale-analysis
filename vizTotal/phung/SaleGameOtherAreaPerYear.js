import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';
import * as UtilsFunction from './UtilsFunction'


const getNASale = async()=> { 
     const data =await getData();
     let saleGameJp = []; 
    for (let k =1983;k<2018;k++){
        let totalSaleInYear = 0; 
        data.forEach(item => {
             if(item.Year == k){
                 totalSaleInYear += Number(item.NA_Sales); 
             }
        })
        saleGameJp.push({
             'Year' : k.toString(), 
             'Sale' : totalSaleInYear.toString()
        })
       
    }
    return saleGameJp ; 
      
    }
    const getOtherSalePerYear = async()=> { 
      const data =await getData();
      let saleGameEu = []; 
     for (let k =1983;k<2018;k++){
         let totalSaleInYear = 0; 
         data.forEach(item => {
              if(item.Year == k){
                  totalSaleInYear += Number(item.Other_Sales); 
              }
         })
         saleGameEu.push({
              'Year' : k.toString(), 
              'Sale' : totalSaleInYear.toString()
         })
        
     }
     return saleGameEu ;
     }

export const SaleNAPerYear = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title("Thị trường Bắc Mỹ "),
    vl.y().fieldQ('Sale').scale({ zero: false }).title("million dollar")
  )

const SaleOtherPerYear = vl
  .markLine()
   .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title("Các thị trường khác "),
    vl.y().fieldQ('Sale').scale({ zero: false }).title("million dollar")
   ) 
const run = async () => { 
    const dataNA  = await getNASale(); 
    const dataOther = await getOtherSalePerYear()
  
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
    d.replaceWith(await vl.hconcat(marksNA,markOther).render(),d); 
  };
    
  run(); 