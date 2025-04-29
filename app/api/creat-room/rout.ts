export async  function POST (request:Request){
    const {roomName,duration}=request.body;
    console.log(roomName,duration)
}