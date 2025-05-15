import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import api from "../api/axios";
import {useNavigate } from "react-router-dom";

function Login({setIsLogin}){
    const [user,setUser] =useState({
        uiId:'',
        uiPwd:''
    });
    const navigate = useNavigate();
    async function submit(e){
        e.preventDefault();
        console.log(user);
        if(!user) return;
        try{
        const res = await api.post('/users/login',user);
        const resUser = res.data;
        if(resUser.token){
            setIsLogin(true);
            Object.keys(resUser).forEach((key)=>{
                localStorage.setItem(key,resUser[key]);
            });
            navigate('/');
        }
    }catch(e){
        console.error(e);
    }
}
    function changeVal(e){
        setUser({
            ...user,
            [e.target.id] : e.target.value
        })
    }
    return(
        <Container maxWidth="sm">
            <Box sx={{mt:8,display:'flex',flexDirection:'column',alignItems:'center'}}>
                <Typography variant="h4" component="h1">
                    로그인
                </Typography>
                <Box component="form" onSubmit={submit}>
                    <TextField margin="normal" required fullWidth label="아이디" id="uiId"
                    value={user.uiId} onChange={changeVal}/>
                    <TextField margin="normal" required fullWidth label="비밀번호" id="uiPwd"
                    type="password" value={user.uiPwd} onChange={changeVal}/>
                    <Button type="submit" fullWidth color="primary" variant="contained">
                        로그인
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
export default Login;