import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";

function MyPage(){
    const navigate = useNavigate();
     const [user,setUser] =useState({
        uiId :'',
        uiPwd:'',
        uiPwd2:'',
        uiName:'',
        uiZip:'',
        uiAddress1:'',
        uiAddress2:'',
        uiPhone:'',
        uiDesc:'',
        });
        useEffect(()=>{
            async function fetchUser(){
                try{
                    const uiNum = localStorage.getItem("uiNum");
                    const res = await api.get(`/users/${uiNum}`);
                    setUser(res.data);
                }catch(e){
                    console.error(e);
                    alert('로그인이 필요합니다.');
                    navigate('/login')
                }
            }
            fetchUser();
        },[])
        async function submit(e){
            e.preventDefault();
            if (user.uiPwd !== user.uiPwd2) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
            try{
                const res = await api.put('/users',user);
                if(res.data===1){
                    alert('회원정보가 수정되었습니다.');
                }else{
                    alert('수정 실패. 다시 시도해주세요.');
                }
            }catch(err){
                console.error(err);
            }
        }
        function changeVal(e){
            setUser({
                ...user,
                [e.target.id] : e.target.value
            });
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
                        <TextField id="uiZip" value={user.uiZip} onChange={changeVal}/>
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
export default MyPage;