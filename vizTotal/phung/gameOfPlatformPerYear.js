import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';
import * as UtilsFunction from './UtilsFunction'

const findPlatform =(flatformName,flatformArr,Year) =>{
    let pos =-1;  
    if(flatformArr.length == 0){
         return pos ; 
    }
     flatformArr.forEach((flatform,index)=>{
        if(flatform.Platform_name == flatformName && flatform.Year == Year ){
             pos = index ; 
        }
     })
     return pos ; 
}
const getNumberGameOfPlatformPerYear =async()=>{
     const data =await getData(); 
     let numberGameofPlatformPerYear=[]; 
   
         data.forEach(item=>{
            let pos = findPlatform(item.Platform,numberGameofPlatformPerYear,item.Year); 
             if(pos == -1 ){
                 numberGameofPlatformPerYear.push({
                     'Year' :item.Year , 
                     'Platform_name' : item.Platform , 
                     'number_game' : "1"
                 })
             }else{

                let number_game1 =Number(numberGameofPlatformPerYear[pos].number_game) + 1 ; 
                 numberGameofPlatformPerYear[pos] = {
                  'Year' : item.Year, 
                  'Platform_name' : item.Platform , 
                  'number_game' : number_game1.toString()
                 }
             }
         })
         return numberGameofPlatformPerYear ; 
     }
   


const findFlatform1 = (PlatformName , PlatformArr)=>{
  let pos =-1 ; 
   if(PlatformArr.length ==0){
     return pos; 
   }else{
     PlatformArr.forEach((item,index)=>{
       if(item.Platform_name==PlatformName){
          pos = index ; 
       }
     })
   }
   return pos ; 
}
const numberGameOf5Platform =(data)=>{
    let numberGameOf5Platform = []; 
    data.forEach((item,index) =>{
      let pos = findFlatform1(item.Platform_name,numberGameOf5Platform) ; 
       if(pos ==-1){
         numberGameOf5Platform.push({
           'Platform_name' : item.Platform_name , 
           'number_game' : item.number_game 
         })
       }else{
        let number_game =  Number(numberGameOf5Platform[pos].number_game) + Number(item.number_game); 
         numberGameOf5Platform[pos] = {
           ...numberGameOf5Platform[pos], 
           'number_game' : number_game.toString(), 
         }
       }
    })
    return numberGameOf5Platform.sort((a,b)=>{
       return  Number(b.number_game) - Number(a.number_game); 
    }).slice(0,5).map(item=>{
       return item.Platform_name; 
    }); 
}


export const gameOfPlatformPerYear  = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title(null),
    vl.y().fieldQ('number_game').scale({ zero: false }).title("number game"), 
    vl.color().fieldN('Platform_name').title("platform"), 
    // vl.opacity().if(selection, vl.value(0.75)).value(0.05)
    vl.tooltip(["Platform_name"])
  );
  
const run = async () => {

    const data1  = await getNumberGameOfPlatformPerYear(); 

    const data2 =  numberGameOf5Platform(data1); 

    const data = data1.filter(item=>{
        return data2.includes(item.Platform_name)
    })
   
    const marks = gameOfPlatformPerYear
      .data(data)
      // .width(window.innerWidth)
      
      .width(1200)
      .height(500)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);
    
    let d = document.getElementById("gameOfPlatformPerYear"); 
    d.replaceWith(await marks.render(),d); 
  };
    
  run(); 