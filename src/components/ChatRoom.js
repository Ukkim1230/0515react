import { Form, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { AppBar, Box, Button, Paper, TextField, Toolbar, Typography } from "@mui/material";
import { toast } from "react-toastify";

function ChatRoom(){
    const {roomId} = useParams();
    const navigate = useNavigate();
    const stompClient = useRef(null);
    const [name, setName] = useState('');
    const [messages, setMessages] = useState([]); //주고 받은 메세지를 저장
    const [users, setUsers] = useState([]); // 방에 입장한 유저들 저장
    const [message,setMessage] = useState(''); //입력한 메세지
    const [targetUser, setTargetUser] = useState({})//접속 유저 목록에서 선택한 유저
    const scrollRef = useRef(null);

    const uiNum = parseInt(localStorage.getItem('uiNum'));
    const uiName = localStorage.getItem('uiName');
    const enterMessage = {
        uiNum,
        uiName,
        roomId,
        name,
    };
    const clickUser = (targetUser)=>{
        if(targetUser.uiNum !== uiNum){
            setTargetUser(targetUser);
        }else{
            setTargetUser(null);
        }
    }
    const disconnect = useCallback(()=>{
        if(stompClient.current?.connected){
            enterMessage.type = 'LEAVE';
            stompClient.current?.send('/app/chat/leave', {},JSON.stringify(enterMessage));
            stompClient.current.disconnect();
            stompClient.current=null;
        }
    })
    useEffect(()=>{
        getChatRoom();
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({},()=>{
            stompClient.current.subscribe(`/topic/users/${roomId}`, (res)=>{
                const userList = JSON.parse(res.body);
                setUsers(userList);
            });
            stompClient.current.subscribe(`/topic/room/${roomId}/${uiNum}`,(res)=>{
                setMessages((pre)=>{
                    return [...pre, JSON.parse(res.body)];
                });
            });
            stompClient.current.subscribe(`/topic/room/${roomId}`, (res)=>{
                setMessages((pre)=>{
                    return [...pre, JSON.parse(res.body)];
                });
            });
            enterMessage.type = 'JOIN'; //uiNum : 1, uiName : 홍길동 , roomId:4,type:
            stompClient.current.send('/app/chat/enter',{},JSON.stringify(enterMessage));
        });
        window.addEventListener('beforeunload',function(){
            disconnect();
        })
        return()=>{
            disconnect();
        }
    },[]);

    const getChatRoom = async function(){
        const res = await api.get(`/chatrooms/${roomId}`);
        console.log(res.data);
        setName(res.data.name);
    }
    const sendMessage = (e)=>{
        e.preventDefault();
        if(message.trim().length<2){
            toast.warn('메세지는 2글자 이상입력 바랍니다.');
            return;
    }
    if(stompClient.current){
        const chatMessage = {
            ...enterMessage,
            type: 'CHAT',
            text : message
        }
        if(targetUser){
            chatMessage.type = 'WHISPER'
            chatMessage.targetUiNum = targetUser.uiNum;
        }
        stompClient.current.send('/app/chat/message', {}, JSON.stringify(chatMessage));
        setMessage('');
    }
};
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
            <Box sx={{flex:1, display:'flex',overflow:'hidden'}}>
                <Paper sx={{flex:1, overflow:'auto',p:2,mb:2, minHeight : '300px' ,maxHeight:'300px'}}>
                    {messages.map((message,idx) =>(
                        <Box key={idx} sx={{mb:1,display:'flex',flexDirection:'column'
                            ,alignItems: parseInt(uiNum) === message.uiNum?'flex-end':'flex-start'}}>
                                {message.type==='CHAT'?(
                                    <>
                                <Typography variant="caption" color="textSecondary">
                                    {message.uiName}
                                </Typography>
                                <Typography variant="body1">
                                    {message.text}
                                </Typography>
                                </>
                                ):message.type==='WHISPER'?(
                                    <>
                                    <Typography variant="caption" sx={{color:'blue'}}>
                                        {message.uiName}
                                    </Typography>
                                    <Typography variant="body1">
                                        {message.text}
                                    </Typography>
                                    </>
                                ):(
                                <Typography variant="caption" color="textSecondary">
                                    <b>{message.uiName}님이 {message.type==='LEAVE'?' 나가셨습니다.' : '입장하셨습니다.'}</b>
                                </Typography>
                                )}
                            </Box>
                    ))}
                    <div ref={scrollRef}/>
                </Paper>
                <Paper sx={{width:200,p:2,borderLeft: '1px solid',display:{xs:'none',md:'block'},maxHeight:300}}>
                    <Typography variant="subtitle1">
                        <b>접속 유저({users.length})</b>
                    </Typography>
                {users.map((user,idx)=>(
                    <Box key={idx} sx={{mb:1, cursor:'pointer',
                        bgcolor: targetUser?.uiNum===user.uiNum ? '#aabccc' : '',
                        '&:hover':{
                            bgcolor:'#aabbcc',
                        }
                    }}
                    onClick={clickUser.bind(this,user)}>
                        <Typography variant="body1" color="textSecondary" sx={{textAlign:'center',height:'25px'}}>
                            <b>{parseInt(uiNum) === user.uiNum?`${user.uiName}(나)`:user.uiName}</b>
                        </Typography>
                    </Box>
                ))}
                </Paper>
            </Box>
            <form onSubmit={sendMessage}>
                <Box sx={{display:'flex', p:1}}>
                    <TextField fullWidth value={message} onChange={(e) => {setMessage(e.target.value)}}
                    placeholder={targetUser?.uiName?`${targetUser.uiName}에게 귓속말`:'메세지 입력'} variant="outlined"/>
                    <Button type="submit" variant="contained">전송</Button>
                </Box>
            </form>
        </Box>
    )
}
export default ChatRoom;