/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;

const Post = ({ post, currentUser }) => {
	const [userFavorites, setUserFavorites] = useState([]);
	const [shouldRefetch, setShouldRefetch] = useState(false);

	console.log(userFavorites);
	useEffect(() => {
		const fetchUserFavorites = async () => {
			const favorites = await fetch(
				`${url}/api/items/user/${currentUser.user_id}/favorites`
			);
			const data = await favorites.json();
			setUserFavorites(data);
			setShouldRefetch(false);
		};
		fetchUserFavorites();
	}, [currentUser, shouldRefetch]);

	const handleFavoriteChange = (postId, action) => async () => {
		if (action === 'add') {
			await fetch(
				`${url}/api/items/user/${currentUser.user_id}/favorites/${postId}`,
				{
					method: 'PUT',
				}
			);
			setShouldRefetch(true);
		} else if (action === 'remove') {
			await fetch(
				`${url}/api/items/user/${currentUser.user_id}/favorites/${postId}`,
				{
					method: 'DELETE',
				}
			);
			setShouldRefetch(true);
		}
	};
	return (
		<Box
			sx={{
				padding: '25px',
				marginTop: '20px',
				marginBottom: '20px',
				borderRadius: '5px',
				border: '1px solid black',
			}}
		>
			<Box
				sx={{
					display: 'flex',
				}}
			>
				<Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
						}}
					>
						<h1>{post.Title}</h1>
						<p>{post.Description}</p>
					</Box>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography
							sx={{
								font: 'normal bold 16px/1 Arial, sans-serif',
							}}
						>
							{post.Category}{' '}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Box sx={{ marginTop: '20px' }}>
				{currentUser.user_id === post.Owner ? (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Box>
							<Button
								sx={{ marginRight: '10px' }}
								onClick={() => {
									window.location.href = `/edit/${post._id}`;
								}}
								color='inherit'
								variant='outlined'
							>
								Edit
							</Button>
							<Button
								onClick={async () => {
									await fetch(url + '/api/item/' + post._id, {
										method: 'DELETE',
									});
									window.location.href = '/';
								}}
								color='inherit'
								variant='outlined'
							>
								Delete
							</Button>
						</Box>
						<Box>
							{userFavorites.includes(post._id) ? (
								<IconButton
									onClick={handleFavoriteChange(
										post._id,
										'remove'
									)}
								>
									<FavoriteIcon />
								</IconButton>
							) : (
								<IconButton
									onClick={handleFavoriteChange(
										post._id,
										'add'
									)}
								>
									<FavoriteBorderIcon />
								</IconButton>
							)}

							<Button
								onClick={() => {
									window.location.href = `/post/${post._id}`;
								}}
								color='inherit'
								variant='outlined'
							>
								Read more
							</Button>
						</Box>
					</Box>
				) : null}
			</Box>
		</Box>
	);
};

export default Post;
