import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header({isLogin,setIsLogin}){
    console.log(isLogin)//false
    const navigate = useNavigate();
    function logout(){
        localStorage.clear();
        setIsLogin(false);
        navigate('/login');
    }
    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h5" component="h1">
                    로그인 로직 테스트
                </Typography>
                <Box>
                    {isLogin?(
                        <>
                    <Button color="inherit" onClick={()=>navigate('/my-page')}>My Page</Button>
                    <Button color="inherit" onClick={logout}>로그아웃</Button>
                    <Button color="inherit" onClick={()=>navigate('/')}>홈</Button>
                    <Button color="inherit" onClick={()=>navigate('/chat-rooms')}>채팅</Button>
                    </>
                ):(<>
                    <Button color="inherit" onClick={()=>navigate('/login')}>로그인</Button>
                    <Button color="inherit" onClick={()=>navigate('/join')}>회원가입</Button>
                    </>
                )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
export default Header;