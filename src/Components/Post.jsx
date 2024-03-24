/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
// const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}`;
const auth0token = import.meta.env.VITE_AUTH0_TOKEN;
const auth0domain = import.meta.env.VITE_AUTH0_DOMAIN;

const Post = ({ post, currentUser }) => {
	const [userFavorites, setUserFavorites] = useState([]);
	const [shouldRefetch, setShouldRefetch] = useState(false);
	const [adminUsers, setAdminUsers] = useState([]);

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
			// update user favorites
			await fetch(
				`${url}/api/items/user/${currentUser.user_id}/favorites/${postId}`,
				{
					method: 'PUT',
				}
			);
			// update favoritedBy
			await fetch(
				`${url}/api/items/${postId}/user/${currentUser.user_id}/favorites`,
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
			await fetch(
				`${url}/api/items/${postId}/user/${currentUser.user_id}/favorites`,
				{
					method: 'DELETE',
				}
			);
			setShouldRefetch(true);
		}
	};

	const isUserAdmin = adminUsers?.some(
		(user) => user.user_id === currentUser.user_id
	);
	useEffect(() => {
		var myHeaders = new Headers();
		myHeaders.append('Accept', 'application/json');
		myHeaders.append('Authorization', auth0token);

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};

		fetch(
			`https://${auth0domain}/api/v2/roles/rol_73zk03NBdD7qLKXD/users`,
			requestOptions
		)
			.then((response) => response.json())
			.then((result) => {
				// iterate through the users array and check if the user is in the array
				setAdminUsers(result);
			})
			.catch((error) => console.log('error', error));
	}, []);

	if (!post || !currentUser) return null;

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
						<Typography
							sx={{
								color:
									post.Status === 'active' ? 'green' : 'red',
							}}
						>
							{post.Status === 'inactive' ? 'inactive' : null}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Box sx={{ marginTop: '20px' }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					{currentUser.user_id === post.Owner || isUserAdmin ? (
						<Box>
							<Link to={`/edit/${post._id}`}>
								<Button
									sx={{ marginRight: '10px' }}
									variant='outlined'
								>
									Edit
								</Button>
							</Link>
							<Button
								onClick={async () => {
									await fetch(url + '/api/item/' + post._id, {
										method: 'DELETE',
									});
									window.location.href = '/';
								}}
								variant='outlined'
							>
								Delete
							</Button>
						</Box>
					) : (
						<Box></Box>
					)}

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
						}}
					>
						{Object.keys(currentUser).length > 0 && (
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
							</Box>
						)}
						<Link to={`/post/${post._id}`}>
							<Button variant='outlined'>Read more</Button>
						</Link>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Post;
