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
        return(
            <Container maxWidth="sm">
                <Box sx={{mt:2,display:'flex',flexDirection:'column',alignItems:'center'}}>
                <Typography variant="h4" component="h1">
                    마이페이지
                </Typography>
                    <Box>
                        <TextField margin="normal" required fullWidth label="아이디" id="uiId"
                        value={user.uiId}/>
                        <TextField margin="normal" required fullWidth label="비밀번호" id="uiPwd"
                        type="password" value={user.uiPwd}/>
                         <TextField margin="normal" required fullWidth label="비밀번호확인" id="uiPwd2"
                        type="password" value={user.uiPwd2}/>
                         <TextField margin="normal" required fullWidth label="이름" id="uiName"
                        value={user.uiName}/>
                        <TextField margin="normal" required fullWidth label="휴대폰번호" id="uiPhone"
                        value={user.uiPhone}/>
                        <TextField id="uiZip" value={user.uiZip}/>
                        <TextField margin="normal" required fullWidth label="기본주소" id="uiAddress1"
                        readonly value={user.uiAddress1}/>
                        <TextField margin="normal" required fullWidth label="상세주소" id="uiAddress2"
                        readonly value={user.uiAddress2}/>
                        <TextField margin="normal" fullWidth label="자기소개" id="uiDesc"
                        value={user.uiDesc} multiline rows={8}/>
    
                        <Button type="submit" color="info" variant="contained" sx={{height:50,mt:2.2,ml:1}}>
                            등록
                        </Button>
                    </Box>
                </Box>
            </Container>
        )
}
export default MyPage;