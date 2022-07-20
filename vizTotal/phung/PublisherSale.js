import vl from 'vega-lite-api';
import { config } from '../../config';
import { getData } from '../../getData';
import * as UtilsFunction from './UtilsFunction'


export const PublisherSale  = vl
  .markLine()
  .encode(
    vl.x().fieldT('Year').scale({ zero: false }).title(null),
    vl.y().fieldQ('Global_Sales').scale({ zero: false }).title("Global Sales"), 
    vl.color().fieldN('Publisher'), 
    vl.tooltip(['Publisher'])
  );
  
const run = async () => {
    const data  = await UtilsFunction.topPublisherBestSaleGlobalPerYear(5);
    const marks = PublisherSale
      .data(data)
      // .width(window.innerWidth)
      
      .width(1000)
      .height(300)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);
    
    let d = document.getElementById("top5saleperyear"); 
    d.replaceWith(await marks.render(),d); 
  };
    
  run(); 