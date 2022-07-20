import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';

const findGame= (publisher_name,Year,gameOfPubArr)=>{
    let pos =-1; 
    if(gameOfPubArr.length==0){
         return pos ; 
    }else{
         gameOfPubArr.forEach((item,index)=>{
             if (item.Publisher == publisher_name && Year==item.Year){
                 pos = index ; 
             }
         })
    }
     return pos ; 
}

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
             })
        }else{
             newData[pos] = {
                 ...newData[pos], 
                 'game_number': (Number(newData[pos].game_number)+1).toString()
             }
        }
    })
    return newData ; 
   

}


export const gameOfPublisherPerYearLine = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false}).title(null),
    vl.y().fieldQ('game_number').scale({ zero: false }), 

    vl.color().fieldN('Publisher').scale({zero :false})
    // vl.tooltip().fieldN('Genre')
  );

  // export const SalePerYear = vl
const run = async () => {
    const data  = await (await getGameOfPublisher()).filter(item=>{
        let Pub = item.Publisher ; 
         if(Pub=="Electronic Arts"||  Pub=="Nintendo"){
           if(item.Year <= 2020){
             return true ; 
           }
         }
    }); 
    const marksLine  = gameOfPublisherPerYearLine
      .data(data)
    //   .width(window.innerWidth)
      .width(1000)
      .height(300)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);

    const d =document.getElementById("ElectronicAndNitendoGameNumber"); 
    d.replaceWith(await vl.layer(marksLine).render(),d); 
  };
    
  run(); 