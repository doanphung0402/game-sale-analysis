import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';


const totalOtherSales = async()=>{
    const data = await getData(); 
    let newData =[]; 
    for(let k = 1980 ; k<=2020 ;k++){
        let globalSale =0; 
        data.forEach((data)=>{
             if(data.Year == k){
                globalSale += Number(data.Global_Sales); 
             }
        })
        newData.push({
             "Year" : k.toString() , 
             "Global_Sales" : parseFloat(globalSale.toString()).toFixed(2) 
        })
        
    }
    return newData ; 
   

}


export const SalePerYearLine = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false}).title(null),
    vl.y().fieldQ('Global_Sales').scale({ zero: false })

    // vl.color().fieldQ('Global_Sales').scale({zero :false})
    // vl.tooltip().fieldN('Genre')
  );
export const SalePerYearPoint = vl 
  .markPoint()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false} ),
    vl.y().fieldQ('Global_Sales').scale({ zero: false }), 
    vl.tooltip(['Global_Sales'])
  )
  // export const SalePerYear = vl
const run = async () => {
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
    d.replaceWith(await vl.layer(marksLine, marksPoint).render(),d); 
  };
    
  run(); 