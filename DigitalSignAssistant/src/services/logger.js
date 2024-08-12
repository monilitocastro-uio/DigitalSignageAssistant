export const logger = async (obj)=> {
    if(typeof obj === "string")
    {
        console.log(obj);
    }else{
        console.log(obj)
    }
}