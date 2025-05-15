import { useEffect, useState } from "react";

function Home(){
    const [user, setUser] = useState({});
    useEffect(()=>{
        if(localStorage.getItem('token')){
            const tmpUser = {};
            for(let i=0;i<localStorage.length;i++){
                const key = localStorage.key(i);
                tmpUser[key] = localStorage.getItem(key);
            }
            setUser(tmpUser);
        }
        console.log(user);
    },[]);
    return(
        <div>
            <h3>{user.uiName}님 반갑습니다.</h3>
        </div>
    )
}
export default Home;