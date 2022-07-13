import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';

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
                      'game_number' : '1'
                 })
            }else{
                 genreGame[pos] = {
                     ...genreGame[pos], 
                        'game_number' : (Number(genreGame[pos].game_number)+1).toString()
                 }
            }
        })
    

    return genreGame ; 
   

}


export const ActionGamePerYearLine = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false}).title(null),
    vl.y().fieldQ('game_number').scale({ zero: false }),
    vl.color().fieldN('Genre'), 
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
  // export const SalePerYear = vl
const run = async () => {
    const data  =await (await genreGamePerYear()).filter(item=>{
         return item.Genre =='Action'
    });
    console.log("🚀 ~ file: GenreGamePerYear.js ~ line 66 ~ run ~ data", data)
    const marksLine  = ActionGamePerYearLine
      .data(data)
    //   .width(window.innerWidth)
      .width(1000)
      .height(300)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);

    const marksPoint = ActionGamePerYearPoint
       .data(data)
       .width(1000)
       .height(300)
       .autosize({ type: 'fit', contains: 'padding' })
       .config(config);

    const d =document.getElementById("actionGamePerYear"); 
    d.replaceWith(await vl.layer(marksLine,marksPoint).render(),d); 
  };
    
  run(); 