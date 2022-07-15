import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';
import * as UtilsFunction from './UtilsFunction'

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
export const SaleGameNitendo  = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title("Các thị trường khác "),
    vl.y().fieldQ('NA_Sales').scale({ zero: false })
  );
  const SaleJpNitendo = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title("Thị trường Nhật"),
    vl.y().fieldQ('JP_Sales').scale({ zero: false })
  );
  const SaleEuNitendo = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title("Thị trường Châu Âu"),
    vl.y().fieldQ('EU_Sales').scale({ zero: false })
  );
const run = async () => {
    const data  = await UtilsFunction.topPublisherBestSaleGlobalPerYear(1);
    console.log("🚀 ~ file: SaleGameNitendo.js ~ line 28 ~ run ~ data", data)
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
    d.replaceWith(await vl.hconcat(marksSaleEu,marksSaleJp,marksSaleGlobal).render(),d); 
  };
    
  run(); 