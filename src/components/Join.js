import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Join(){
    const navigate = useNavigate();
    const [user,setUser] = useState({
        uiId :'',
        uiPwd:'',
        uiPwd2:'',
        uiName:'',
        uiZip:'',
        uiAddress1:'',
        uiAddress2:'',
        uiPhone:'',
        uiDesc:'',
    })
    async function submit(e){
        e.preventDefault();
        if(user.uiId.trim().length<4){
            alert('아이디는 4글자 이상입니다.');
            return;
        }
        if(user.uiPwd !== user.uiPwd2){
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }
        try{
            const formData = new FormData();
            for(const key in user){
                formData.append(key,user[key]);
            }
           await api.post('/users/join',formData,{
            headers:{
                'Content-Type': 'multipart/form-data'
            }
           });
           alert('회원가입이 완료되었습니다.');
           navigate('/login');
        }catch(e){
            console.log(e);
            if(e.response && e.response.data && e.response.data.errors){
                alert(e.response.data.errors[0].defaultMessage);
            }
        }
    }
    function changeVal(e){
        setUser({
            ...user,
            [e.target.id] : e.target.value
        })
    }
    function searchAddr(){
        if(window.daum){
        new window.daum.Postcode({
            oncomplete : function(data){
                setUser(prev => ({
                    ...prev,
                    uiZip: data.zonecode,
                    uiAddress1: data.roadAddress
                }));
            }
        }).open();
    }
}
    return(
        <Container maxWidth="sm">
            <Box sx={{mt:2,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <Typography variant="h4" component="h1">
                회원가입
            </Typography>
                <Box component="form" onSubmit={submit}>
                    <TextField margin="normal" required fullWidth label="아이디" id="uiId"
                    value={user.uiId} onChange={changeVal}/>
                    <TextField margin="normal" required fullWidth label="비밀번호" id="uiPwd"
                    type="password" value={user.uiPwd} onChange={changeVal}/>
                     <TextField margin="normal" required fullWidth label="비밀번호확인" id="uiPwd2"
                    type="password" value={user.uiPwd2} onChange={changeVal}/>
                     <TextField margin="normal" required fullWidth label="이름" id="uiName"
                    value={user.uiName} onChange={changeVal}/>
                    <TextField margin="normal" required fullWidth label="휴대폰번호" id="uiPhone"
                    value={user.uiPhone} onChange={changeVal}/>
                    <TextField id="uiZip" value={user.uiZip} onChange={changeVal} readonly/>
                    <Button color="info" variant="contained" onClick={searchAddr} sx={{height:50,mt:2.2,ml:1}}>
                        주소검색
                    </Button>
                    <TextField margin="normal" required fullWidth label="기본주소" id="uiAddress1"
                    readonly value={user.uiAddress1} onChange={changeVal}/>
                    <TextField margin="normal" required fullWidth label="상세주소" id="uiAddress2"
                    readonly value={user.uiAddress2} onChange={changeVal}/>
                    <TextField margin="normal" fullWidth label="자기소개" id="uiDesc"
                    value={user.uiDesc} onChange={changeVal} multiline rows={8}/>

                    <Button type="submit" color="info" variant="contained" sx={{height:50,mt:2.2,ml:1}}>
                        등록
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
export default Join;