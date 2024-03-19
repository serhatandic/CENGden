/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;

const PostDetails = ({ allUsers, currentUser }) => {
	const { id } = useParams();
	const [postDetails, setPostDetails] = useState({});
	useEffect(() => {
		const fetchPost = async () => {
			const response = await fetch(`${url}/api/item/${id}`);
			const data = await response.json();
			setPostDetails(data['result']);
		};
		fetchPost();
	}, [id]);
	return (
		postDetails &&
		postDetails?.Attributes && (
			<Box
				sx={{
					display: 'flex',
					flexDirection: {
						xs: 'column',
						md: 'row',
					},
					gap: '20px',
					marginTop: '15vh',
					marginBottom: '10vh',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-around',
						padding: '20px',
						boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
						borderRadius: '8px',
						backgroundColor: '#f9f9f9',
						gap: '10px',
					}}
				>
					<Box
						sx={{
							width: '100%',
							height: '200px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#ececec',
							borderRadius: '4px',
						}}
					>
						image goes here
					</Box>
					<Box sx={{ mt: '10px', textAlign: 'center' }}>
						Description: {postDetails?.Description}
					</Box>
					<Box
						sx={{
							mt: '10px',
							textAlign: 'center',
							fontWeight: 'bold',
						}}
					>
						Price: {postDetails?.Price}
					</Box>
				</Box>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '20px',
					}}
				>
					<Box
						style={{
							padding: '20px',
							boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
							borderRadius: '8px',
							backgroundColor: '#ffffff',
							height: 'fit-content',
						}}
					>
						<Typography
							variant='h6'
							style={{ marginBottom: '10px' }}
						>
							Seller
						</Typography>
						{allUsers.map((user) => {
							if (
								user.id === postDetails.UserId &&
								user.user_metadata
							) {
								return (
									<Box
										key={user.id}
										style={{ marginBottom: '10px' }}
									>
										<Typography variant='body1'>
											{user.user_metadata.name}
										</Typography>
										{currentUser?.user_id && (
											<>
												<Typography variant='body1'>
													{user.email}
												</Typography>
												<Typography variant='body1'>
													{
														user.user_metadata
															.phone_number
													}
												</Typography>
											</>
										)}
									</Box>
								);
							}
							return null;
						})}
					</Box>

					<Box>
						{Object.keys(postDetails.Attributes).map((key) => (
							<table
								key={key}
								style={{
									border: '1px solid #ddd',
									borderCollapse: 'collapse',
									width: '100%',
									marginBottom: '10px',
									marginLeft: 'auto',
									marginRight: 'auto',
									backgroundColor: '#fafafa',
									boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
								}}
							>
								<thead>
									<tr style={{ backgroundColor: '#f0f0f0' }}>
										{' '}
										{/* Header background */}
										<th
											style={{
												textAlign: 'left',
												padding: '8px',
											}}
										>
											{key[0].toUpperCase() +
												key.slice(1)}
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td
											style={{
												textAlign: 'left',
												padding: '8px',
											}}
										>
											{postDetails.Attributes[key]}
										</td>
									</tr>
								</tbody>
							</table>
						))}
					</Box>
				</Box>
			</Box>
		)
	);
};

export default PostDetails;
