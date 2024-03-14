/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;

const PostDetails = ({ allUsers }) => {
	console.log(allUsers);
	const { id } = useParams();
	const [postDetails, setPostDetails] = useState({});
	useEffect(() => {
		const fetchPost = async () => {
			const response = await fetch(`${url}/api/item/${id}`);
			const data = await response.json();
			setPostDetails(data);
			console.log(data);
		};
		fetchPost();
	}, [id]);
	return (
		postDetails &&
		postDetails?.Attributes && (
			<Box sx={{ display: 'flex', gap: '20px' }}>
				<Box>
					<Box>image goes here</Box>
					<Box>Description: {postDetails?.Description}</Box>
					<Box>Price: {postDetails?.Price}</Box>
				</Box>
				<Box>
					{Object.keys(postDetails.Attributes).map((key) => {
						return (
							<table key={key}>
								<thead>
									<tr>
										<th>
											{key[0].toUpperCase() +
												key.slice(1)}
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{postDetails.Attributes[key]}</td>
									</tr>
								</tbody>
							</table>
						);
					})}
				</Box>
				<Box>
					<Typography variant='h6'>Seller</Typography>
					{allUsers.map((user) => {
						if (
							user.id === postDetails.UserId &&
							user.user_metadata
						) {
							return (
								<Box key={user.id}>
									<Typography variant='body1'>
										{user.user_metadata.name}
									</Typography>
									<Typography variant='body1'>
										{user.email}
									</Typography>
									<Typography variant='body1'>
										{user.user_metadata.phone_number}
									</Typography>
								</Box>
							);
						}
						return null;
					})}
				</Box>
			</Box>
		)
	);
};

export default PostDetails;
