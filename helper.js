
 export function filterUserHelper (data, userid= null){
    return  data.filter((item) => item.id.toString() === userid.toString());
}
export function deleteUserHelper (data, userId){
const f = data.filter((item) => item.id !== userId );
  console.log(f, "dd");
return f
}

export function responseHelper (res, message){
    const {status,mes, header} = message
    res.writeHead(status,{'Content-Type': `${header}`})
    res.write(JSON.stringify(mes))
    res.end()
}


export function  replaceURLHelper (url, replacement ){
  return url.replace(":id", replacement)
}


export function updateUserHelper (data, userId, body){
return  data.map((item) => item.id.toString() === userId.toString() ? { ...item, body } : item);
}