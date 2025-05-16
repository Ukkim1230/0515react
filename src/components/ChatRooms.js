import { useEffect, useState } from "react";
import api from "../api/axios";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { dateFormat } from "../utils/FormatUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ChatRooms(){
    const[ChatRooms,setChatRooms] = useState([]);
    const[isOpen,setIsOpen] = useState(false);
    const[name,setName] = useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        getChatRooms();
    },[])

    const getChatRooms = async function(){
        const res = await api.get('/chatrooms');
        setChatRooms(res.data);
        console.log(ChatRooms);
    }
    const makeChatRoom = async function(){
        const uiNum = localStorage.getItem('uiNum');
        const param = {
            name,
            uiNum
        }
        try{
            const res = await api.post('/chatrooms',param);
            toast.info(`${name}이 생성되었습니다.`);
            navigate(`/chat-room/${res.data}`);
        }catch(e){
            console.error(e);
        }
    }
    return(
        <Box sx={{p:3}}>
            <Button variant="contained" onClick={()=>setIsOpen(true)}>
                채팅방 만들기
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>채팅방 이름</TableCell>
                            <TableCell>방장</TableCell>
                            <TableCell>생성일</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            ChatRooms.map((ChatRoom)=>
                                <TableRow
                                hover
                                key={ChatRoom.roomId}
                                onClick={()=> navigate(`/chat-room/${ChatRoom.roomId}`)}
                                >
                                    <TableCell>{ChatRoom.roomId}</TableCell>
                                    <TableCell>{ChatRoom.name}</TableCell>
                                    <TableCell>{ChatRoom.uiName}</TableCell>
                                    <TableCell>{dateFormat(ChatRoom.credat)}</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isOpen} onClose={()=>setIsOpen(false)}>
                <DialogTitle>새채팅방</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="채팅방 이름"
                        fullWidth
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={makeChatRoom}>채팅방생성</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
export default ChatRooms;