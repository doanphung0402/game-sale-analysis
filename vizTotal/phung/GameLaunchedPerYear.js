import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';
import * as UtilsFunction from './UtilsFunction'

const gameLaunchedPerYear = async() =>{
     const data = await getData(); 
     let gameLaunched = []; 
     for(let k =1980 ;k<2021;k++){
       let numberGame = 0; 
       data.forEach(item=>{
             if(item.Year == k){
                numberGame++; 
             } 
         })
         gameLaunched.push({
            "Year" : k.toString(), 
            "number_game" : numberGame.toString()
        })
     }
     return gameLaunched; 
}
export const gameLaunchedPerYearLine  = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title(null),
    vl.y().fieldQ('number_game').scale({ zero: false }), 
  );
const gameLaunchedPerYearPoint = vl
   .markPoint()
   .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title(null),
    vl.y().fieldQ('number_game').scale({ zero: false }), 
    vl.tooltip(['number_game'])
   )
const run = async () => {
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
    d.replaceWith(await vl.layer(marksLine,markPoint).render(),d); 
  };
    
  run(); 