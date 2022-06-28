import { csv } from 'd3';

const csvUrl = 'https://gist.githubusercontent.com/doanphung0402/a4e494863b30f45d7381cc9bed4f6b8b/raw/2a2c3d94c182c791d3cf5fb906bfdd25013301a8/game-sale-analysis-data';

export const getData = async () => {
  const data = await csv(csvUrl);
  
  // Have a look at the attributes available in the console!
  console.log(data[0]);

  return data;
};