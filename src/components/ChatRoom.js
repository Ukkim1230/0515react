import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

function ChatRoom(){
    const {roomId} = useParams();
    const stompClient = useRef(null);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const uiNum = localStorage.getItem('uiNum');
        const uiName = localStorage.getItem('uiName');
        const enterMessage = {
            uiNum,
            uiName,
            roomId,
        };
        getChatRoom();
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({},()=>{
            stompClient.current.subscribe(`/topic/room/${roomId}`,(res)=>{
                const chatMessage = JSON.parse(res.body);
            });
            enterMessage.type= 'JOIN';
            stompClient.current.send('/app/chat/enter',{},JSON.stringify(enterMessage));
        })
        return()=>{
            enterMessage.type= 'LEAVE';
        }
    },[]);
    const getChatRoom = async function(){
        const res = await api.get(`/chatrooms/${roomId}`);
        console.log(res.data);
        setName(res.data.name);
    }
    return(
        <Box sx={{p:2, display:'flex',flexDirection:"column"}}>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" onClick={()=>navigate('/chat-rooms')}>
                        뒤로가기
                    </Button>
                    <Typography variant="h6" component="h1">
                        {name}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
export default ChatRoom;