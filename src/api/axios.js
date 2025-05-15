import axios from "axios";
import { toast } from "react-toastify";

const baseURL = 'http://localhost:8080';
const api = axios.create({
    baseURL,
    headers:{
        'Content-Type' : 'application/json'
    }
})
//parameter 2개다 function 1.정상적일 때 동작할 코드 2. 오류가 발생했을 때
api.interceptors.response.use(function(res){
    return res;
}, function(err){
    const {status, data,} = err.response;
    console.log(status);
    console.log(data);
    if(status===500){
        if(data.message){
            toast.error(data.message);
            return Promise.reject(err);
        }
    }else if(status===400){
        const {message,errors} = data;
        if(errors&&errors[0].defaultMessage){
            toast.error(errors[0].defaultMessage);
            return Promise.reject(err);
        }
        if(message){
            toast.error(message);
            return Promise.reject(err);
        }
    }
    toast.error('알수 없는 오류입니다. 관리자에게 문의 바랍니다.');
    return Promise.reject(err);
});
export default api;