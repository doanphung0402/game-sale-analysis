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
             "Global_Sales" : globalSale.toString() 
        })
        
    }
    console.log("🚀 ~ file: growthCategory.js ~ line 9 ~ totalOtherSales ~ newData", newData)
    return newData ; 
   

}


export const SalePerYear = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false} ),
    vl.y().fieldQ('Global_Sales').scale({ zero: false })

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