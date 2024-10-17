// 'use client' => dont need this as its selector is on layout which is already use client
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '@/redux/store';
import { getUserData, uploadphoto } from '@/redux/slices/loginSlice';
import Image from 'next/image';
import { Button } from '@mui/material';
import { logout } from '@/redux/slices/loginSlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));



export default function Navbar() {
  let router = useRouter()
  let dispatch = useDispatch<AppDispatch>();
  let {token,userData} = useSelector((state:AppState)=>state.loginData)
  
  React.useEffect(() => {
    if (token) {
      dispatch(getUserData())
    }
  }, [userData,token, dispatch])
  

  function logoutt() {
    dispatch(logout());
    router.push('/login');
  }

  function login() {
    router.push('/login')
  }

  async function uploadUserPhoto(event:Event | any) {
    let photo = event.target.files[0];
    let formData = new FormData()
    formData.append('photo', photo);
    await dispatch(uploadphoto(formData))
  }
  function goToProfile() {
    router.push('/profile')
  }
  function register() {
    router.push('/register')
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
    
    {token ? (
    [
      <MenuItem key="profile" onClick={()=>{handleMenuClose(); goToProfile()}}>Profile</MenuItem>,
      <MenuItem key="logout" onClick={()=>{handleMenuClose();logoutt();}}>Logout</MenuItem>,
      <MenuItem key="photo" onClick={()=>{handleMenuClose();}}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
        >
          Upload photo
          <VisuallyHiddenInput
            type="file"
            onChange={uploadUserPhoto}
            id='image'
            name='image'
          />
      </Button>
      </MenuItem>,
    ]
  ) : ([
    <MenuItem key="login" onClick={()=>{handleMenuClose();login()}}>Login</MenuItem>,
    <MenuItem key="register" onClick={()=>{handleMenuClose();register()}}>Register</MenuItem>
    ]
    )}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          sx={{padding:"0",paddingRight:"5px"}}
        >
          {userData && <Image
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid #1976d2"}}
                    src={userData?.photo}
                    alt={userData?.name}
                />}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Link href={'/'}>
            <Typography
              variant="h6"
              noWrap
              component="div"
            >
              Circle
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {token && (<IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {userData && <Image
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%", objectFit: "cover", backgroundColor: "#1976d2", border: "2px solid white"}}
                    src={userData?.photo}
                    alt={userData?.name}
                />}
              </IconButton>)}
              
            </Box>

          {/* responsive */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                {/* three dots */}
                <MoreIcon />
              </IconButton>
            </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
