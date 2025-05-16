export function dateFormat(str){
    return `${str.substring(0,4)}-${str.substring(4,6)}-${str.substring(6)}`;
}
export function timeFormat(str){
    return `${str.substring(0,2)}-${str.substring(2,4)}-${str.substring(4)}`;
}