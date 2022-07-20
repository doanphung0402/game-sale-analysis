import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';
import * as UtilsFunction from './UtilsFunction'
const findPublisherForYear = (publisherName,PublisherSale,Year) =>{
    let flag = -1 ; 
    if(PublisherSale.length ==0){
         return -1 ; 
    }
    PublisherSale.forEach((publisher,index)=>{
        if(publisher.Publisher == publisherName && publisher.Year == Year){
             flag =  index ; 
        }
    })
    
    return flag ; 
}
export const formatGlobalSale = (Global_Sales) =>{ 
    const pos = Global_Sales.indexOf("\t"); 
    if(pos==-1){
         return Global_Sales; 
    }else {
         return Global_Sales.slice(0,pos); 
    }
}
export const totalGlobalSalesPublisherPerYear = async()=>{
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
    }) 
        return PublisherSale ; 
}
export const SaleGame  = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }),
    vl.y().fieldQ('Global_Sales').scale({ zero: false }).title("Global Sales"),
    vl.color().fieldN('Publisher').scale({zero :false})
  );

const run = async () => {
    const data1 =await (await totalGlobalSalesPublisherPerYear()).filter(item=>{
         return (item.Publisher == "Electronic Arts" || item.Publisher =="Nintendo"); 
    }) 

    const marksSale = SaleGame
    .data(data1)
    // .width(window.innerWidth)
    
    .width(1000)
    .height(300)
    .autosize({ type: 'fit', contains: 'padding' })
    .config(config);
    
    let d = document.getElementById("ElectronicAndNitendoSale"); 
    d.replaceWith(await vl.layer(marksSale).render(),d); 
  };
    
  run(); 