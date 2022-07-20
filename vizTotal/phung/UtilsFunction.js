import { getData } from "../../getData";

export const formatGlobalSale = (Global_Sales) =>{ 
    const pos = Global_Sales.indexOf("\t"); 
    if(pos==-1){
         return Global_Sales; 
    }else {
         return Global_Sales.slice(0,pos); 
    }
}
const findPublisher = (publisherName,PublisherSale) =>{
    let flag = -1 ; 
    if(PublisherSale.length ==0){
         return -1 ; 
    }
    PublisherSale.forEach((publisher,index)=>{
        if(publisher.Publisher == publisherName){
             flag =  index ; 
        }
    })
    
    return flag ; 
}
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
//tong doanh thu cua cac publisher 
export const totalPublisherGlobalSale = async() =>{
    const data = await getData(); 
    let PublisherSale =[]; 
    data.forEach(data1=>{
        let resFind = findPublisher(data1.Publisher,PublisherSale) ; 
        if(resFind != -1){
            PublisherSale[resFind].Global_Sales =(Number(PublisherSale[resFind].Global_Sales)+
              Number(data1.Global_Sales)).toString(); 
        }else {
             PublisherSale.push({
                  "Publisher" : data1.Publisher, 
                  "Global_Sales":parseFloat(formatGlobalSale(data1.Global_Sales)).toFixed(2) 
             }); 

        }
    }) 
     PublisherSale.sort((a,b)=> {
         return b.Global_Sales -a.Global_Sales 
     })
    
    return PublisherSale;
      
}
//tong doanh thu cac nha phat trien qua  cac nam 
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
//doanh thu cua top 5 publisher qua cac nam 
export const topPublisherBestSaleGlobalPerYear = async(top) =>{
     const data = await totalGlobalSalesPublisherPerYear(); 
     const t =  await totalPublisherGlobalSale()
     const topPublisherBestSaleGlobal = await (await totalPublisherGlobalSale()).slice(0,top).map(item=>{
         return item.Publisher ; 
     }); 
    
     return data.filter(item=>{
         if(topPublisherBestSaleGlobal.includes(item.Publisher)){
             return item ; 
         }
     })   
}