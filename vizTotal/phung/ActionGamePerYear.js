import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';
import * as UtilsFunction from './UtilsFunction'
const findGame =(genre,Year,genreGame)=>{ 
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
}

const genreGamePerYear = async()=>{
    const data = await getData(); 
    let genreGame =[]; 
     
   
       
        data.forEach(item=>{
            let pos = findGame(item.Genre,item.Year,genreGame); 
            if(pos ==-1){
                 genreGame.push({
                     'Genre' : item.Genre, 
                     'Year' :item.Year, 
                     'game_number' : '1', 
                     'Global_Sales': UtilsFunction.formatGlobalSale(item.Global_Sales)
                 })
            }else{
              let Global_Sales =  Number(genreGame[pos].Global_Sales) + Number(UtilsFunction.formatGlobalSale(item.Global_Sales)); 
                 genreGame[pos] = {
                     ...genreGame[pos], 
                        'game_number' : (Number(genreGame[pos].game_number)+1).toString(), 
                        'Global_Sales' : Global_Sales.toString()
                 }
            }
        })
    

    return genreGame ; 
   

}


export const ActionGamePerYearLine = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false}).title(null),
    vl.y().fieldQ('game_number').scale({ zero: false })
    // vl.color().fieGenreldQ('Global_Sales').scale({zero :false})
    // vl.tooltip().fieldN('Genre')
  );
export const ActionGamePerYearPoint = vl 
  .markPoint()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false}).title(null),
    vl.y().fieldQ('game_number').scale({ zero: false }), 
    vl.tooltip(['game_number'])
  )
  const ActionGameSaleGlobal = vl
    .markLine()
    .encode(
       vl.x().fieldT('Year').scale({zero :false}), 
       vl.y().fieldQ('Global_Sales').scale({zero : false})
    )
  // export const SalePerYear = vl
const run = async () => {
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
    d.replaceWith(await vl.hconcat( vl.layer(marksLine,marksPoint),marksLineGlobalSale).render(),d); 
  };
    
  run(); 