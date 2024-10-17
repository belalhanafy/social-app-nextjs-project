import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import ShareIcon from "@mui/icons-material/Share";
import { Post } from "@/interfaces/postInterface";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import CommentIcon from '@mui/icons-material/Comment';
import { Box, Button, CircularProgress, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UndoIcon from '@mui/icons-material/Undo';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/redux/store";
import { addComment, deleteComment, getPostComments, updateComment } from "@/redux/slices/commentSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { deletePost, getPosts, updatePost } from "@/redux/slices/postsSlice";
import { jwtDecode } from "jwt-decode";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Bounce, toast } from "react-toastify";



interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: "rotate(0deg)",
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: "rotate(180deg)",
            },
        },
    ],
}));
type DecodedToken = {
    user: string;
    iat: number;
};
function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
  
    const day = date.getUTCDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
  
    const optionsDate: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric", 
        year: "numeric" 
    };
    const formattedDate = date.toLocaleDateString("en-US", optionsDate);
  
    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: "numeric", 
        minute: "numeric",
        second: "numeric",
        hour12: true
    };
    const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
    return `${formattedDate.replace(day.toString(), day + suffix)} at ${formattedTime}`;
  }
export default function RecentPost({ recentpost, postDetailsComments = false }: { recentpost: Post; postDetailsComments?: boolean; }) {
    let { comments } = useSelector((state: AppState) => state.comment)
    let dispatch = useDispatch<AppDispatch>();
    React.useEffect(() => {
        if (postDetailsComments) {
            dispatch(getPostComments(recentpost._id))
        }
    }, [comments,dispatch])
    let { isLoading } = useSelector((state: AppState) => state.post)
    const [fileName, setfileName] = React.useState(null)
    const [updatePostt, setUpdatePostt] = React.useState(false)
    const [updateCommentt, setUpdateCommentt] = React.useState(false)
    const [CommentId, setCommentId] = React.useState('')
    let { token } = useSelector((state: AppState) => state.loginData)
    const decoded = token ? jwtDecode<DecodedToken>(token) : null;
    const user = decoded?.user;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // to change name of button
    function handleFile(e: Event | any) {
        try {
            let file = e.target.files[0].name;
            setfileName(file)
            toast.success("file uploaded successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        } catch (error) {
            toast.error("failed to upload file", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }

    function handleFormSubmit(e: Event | any) {
        e.preventDefault();

        let body = e.target.body.value;
        let image = e.target.image.files[0];
        { image && setfileName(image.name) }
        let formData = new FormData()
        formData.append('body', body);
        { image && formData.append('image', image); }

        dispatch(updatePost({ postId: recentpost._id, formData }));
        e.target.body.value = ''
        setfileName(null)
        setUpdatePostt(false)
    }

    function handleCommentUpdate(e: Event | any, commentId: string) {
        e.preventDefault();
        console.log(e);

        let content = e.target.new_comment.value;

        dispatch(updateComment({ commentId, content }));
        e.target.new_comment.value = ''
        setUpdateCommentt(false)
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function delPost() {
        dispatch(deletePost(recentpost._id))
    }
    function updPost() {
        setUpdatePostt(true)
    }
    function delComment(commentId: string) {
        dispatch(deleteComment(commentId))
    }
    function updComment(commentId: string) {
        setUpdateCommentt(true)
        setCommentId(commentId)
    }
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
                    <MenuItem key="profile" onClick={handleMenuClose}>Profile</MenuItem>,
                    <MenuItem key="logout" onClick={() => { handleMenuClose(); }}>Logout</MenuItem>
                ]
            ) : ([
                <MenuItem key="login" onClick={() => { handleMenuClose(); }}>Login</MenuItem>,
                <MenuItem key="register" onClick={() => { handleMenuClose(); }}>Register</MenuItem>
            ]
            )}
        </Menu>
    );


    const router = useRouter();
    const [expanded, setExpanded] = React.useState(false);

    const addNewComment = (e: Event | any, postId: string) => {
        e.preventDefault();
        let id = postId
        let comment = e.currentTarget.comment.value;
        dispatch(addComment({ id, comment }));
        e.currentTarget.comment.value = ''
        // router.push(`/postDetails/${postId}`);

    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (<>
        <Card sx={{ m: 4, p: 1, pb: 0 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: "white", border: "2px solid #1976d2" }} aria-label="recipe">
                        {recentpost.user.photo && (
                            <Image
                                width={40}
                                height={40}
                                style={{ borderRadius: "50%", objectFit: "cover" }}
                                src={recentpost.user.photo}
                                alt={recentpost.user.name}
                            />
                        )}
                    </Avatar>
                }

                action={
                    user === recentpost.user._id && (
                        <Box sx={{ display: "flex" }} aria-label="settings">
                            <MenuItem onClick={updPost}><EditIcon sx={{ mr: 1 }} />Update</MenuItem>
                            <MenuItem onClick={delPost}><DeleteOutlineRoundedIcon sx={{ mr: 1 }} />Delete</MenuItem>
                        </Box>
                    )
                }
                title={recentpost.user.name}
                subheader={formatDate(recentpost.createdAt)}
            // titleTypographyProps={{
            //     onClick: () => {
            //         router.push("/profile");
            //     },
            //     style: { width: "fit-content", cursor: "pointer" },
            // }}
            />
            {updatePostt ? (
                <form onSubmit={handleFormSubmit}>
                    <Box style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                        <TextField
                            id="body"

                            multiline
                            rows={4}
                            name='body'
                            defaultValue={recentpost.body}
                        />
                        <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >

                            {fileName ? fileName : "Upload files"}
                            <input
                                type="file"
                                onChange={(e) => handleFile(e)}
                                id='image'
                                name='image'
                                style={{ display: 'none' }}
                            />
                        </Button>
                    </Box>
                    {isLoading ? (
                        <Button type='button' fullWidth sx={{ mt: 3 }} variant="contained">
                            <CircularProgress size={20} sx={{ color: "white", fontSize: "15px" }} />
                        </Button>
                    ) : (
                        <Button type='submit' fullWidth sx={{ letterSpacing: 2, mt: 3 }} variant="contained">
                            Update Post
                        </Button>
                    )}
                </form>
            ) : (
                <>
                    <CardContent>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "18px" }}>
                            {recentpost.body}
                        </Typography>
                    </CardContent>
                    {recentpost.image && (
                        <Box sx={{marginBottom:"20px", position: "relative", width: "100%", paddingTop: "56.25%" }}>
                            <Image
                                fill
                                style={{
                                    display: "block",
                                    objectFit: "cover",
                                    border: "1px solid black",
                                    borderRadius: "8px",
                                }}
                                src={recentpost.image}
                                alt={recentpost.body}
                            />
                        </Box>
                    )}
                </>
            )}
            {!postDetailsComments && <CardActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <Tooltip title="Like" placement="top">
                    <IconButton aria-label="add to favorites">
                        <ThumbUpRoundedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip onClick={()=> router.push(`/postDetails/${recentpost._id}`)} title="Comment" placement="top">
                    <IconButton aria-label="comments">
                        < CommentIcon/>
                        <Typography sx={{marginLeft:"8px"}}>{recentpost.comments.length}</Typography>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Share" placement="top">
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>}

            {/* comments */}
            {postDetailsComments && (
                comments.length === 0 ? <Box sx={{ mb: 2, p: 2, backgroundColor: "#eee", borderRadius: "5px",textAlign:"center" }}>
                    <Typography>No Comments Yet</Typography>
                </Box>
                :
                
                comments.map((comment: any) => (<>
                    <Box key={comment._id} sx={{ mb: 2, p: 2, backgroundColor: "#eee", borderRadius: "5px" }}>
                        <CardHeader
                            sx={{ p: 0, mb: 2 }}
                            avatar={
                                <Avatar sx={{ bgcolor: blue[500],border:"2px solid black" }} aria-label="recipe">
                                    {comment.commentCreator.name.charAt(0).toLocaleUpperCase()}
                                </Avatar>

                            }
                            action={
                                user === comment.commentCreator._id && (
                                    <Box sx={{ display: "flex" }} aria-label="settings">
                                        <MenuItem onClick={() => updComment(comment._id)}><EditIcon sx={{ mr: 1 }} />Update</MenuItem>
                                        <MenuItem onClick={() => delComment(comment._id)}><DeleteOutlineRoundedIcon sx={{ mr: 1 }} />Delete</MenuItem>
                                    </Box>
                                )
                            }
                            title={comment.commentCreator.name}
                            subheader={comment.createdAt.slice(0, 10)}
                        />
                        {updateCommentt && comment._id === CommentId ? (<form onSubmit={(e) => handleCommentUpdate(e, comment._id)}>
                            <TextField fullWidth defaultValue={comment.content} id="new_comment" variant="outlined" />
                            <Button type='submit' fullWidth sx={{ letterSpacing: 2, mt: 3 }} variant="contained">
                                update Comment
                            </Button>
                        </form>) : <Typography>{comment.content}</Typography>
                        }


                    </Box>
                </>
                ))
            )}
            {postDetailsComments &&
            <form onSubmit={(e) => addNewComment(e, recentpost._id)} style={{ marginBottom: "20px", padding: "15px" }}>
                <TextField multiline sx={{ mb: 2 }} fullWidth id="comment" label="Write A Comment.." variant="outlined" />
                <Button type="submit" variant="contained" sx={{ letterSpacing: '2px' }}>Add Comment</Button>
            </form>}

        </Card>
        {postDetailsComments &&
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Link href={"/"}>
                    <Button variant="contained"><UndoIcon sx={{ mr: 1 }} /> RETURN TO Home</Button>
                </Link>
            </Box>
        }

    </>
    );
}