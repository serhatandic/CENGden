/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;

const UserPostList = ({ currentUser }) => {
	const [userPosts, setUserPosts] = useState([]);
	const [shouldRefetch, setShouldRefetch] = useState(false);
	useEffect(() => {
		const fetchUserPosts = async () => {
			const posts = await fetch(
				`${url}/api/items/user/${currentUser.user_id}`
			);
			const data = await posts.json();
			setUserPosts(data);
		};
		fetchUserPosts();
		setShouldRefetch(false);
	}, [currentUser, shouldRefetch]);

	const handleStatusChange = async (postId, status) => {
		await fetch(`${url}/api/item/${postId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ Status: status }),
		});
		setShouldRefetch(true);
	};
	return (
		<Box>
			{userPosts.map((post) => {
				return (
					<Box
						sx={{
							border: '1px solid black',
							padding: '10px',
							borderRadius: '5px',
							marginTop: '10px',
						}}
						key={post._id}
					>
						<Box>
							<h1>{post.Title}</h1>
							<p>{post.Description}</p>
							<Typography
								sx={{
									color:
										post.Status === 'active'
											? 'green'
											: 'red',
								}}
							>
								{post.Status}
							</Typography>
						</Box>
						{post.Status === 'active' ? (
							<Button
								variant='outlined'
								onClick={() => {
									handleStatusChange(post._id, 'inactive');
								}}
							>
								Deactivate
							</Button>
						) : (
							<Button
								variant='outlined'
								onClick={() => {
									handleStatusChange(post._id, 'active');
								}}
							>
								Activate
							</Button>
						)}
						<>
							<Link to={`/item/${post._id}`}>
								<Button
									sx={{ marginLeft: '10px' }}
									variant='outlined'
								>
									Edit
								</Button>
							</Link>
							<Button
								sx={{ marginLeft: '10px' }}
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
						</>
					</Box>
				);
			})}
		</Box>
	);
};

export default UserPostList;
