/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;
const auth0token = import.meta.env.VITE_AUTH0_TOKEN;
const auth0domain = import.meta.env.VITE_AUTH0_DOMAIN;

const PostDetails = ({ allUsers, currentUser }) => {
	const { id } = useParams();
	const [postDetails, setPostDetails] = useState({});
	const [isProfilePublic, setIsProfilePublic] = useState(false);
	const [adminUsers, setAdminUsers] = useState([]);

	const isUserAdmin = adminUsers.some(
		(user) => user.user_id === currentUser.user_id
	);
	console.log(postDetails);
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

	useEffect(() => {
		if (!postDetails?.Owner) return;
		const fetchIsPublic = async () => {
			const response = await fetch(
				`${url}/api/user/${postDetails.Owner}/isPublic`
			);
			const data = await response.json();
			setIsProfilePublic(data);
			console.log(data);
		};
		fetchIsPublic();
	}, [postDetails?.Owner]);

	useEffect(() => {
		const fetchPost = async () => {
			const response = await fetch(`${url}/api/item/${id}`);
			const data = await response.json();
			setPostDetails(data['result']);
		};
		fetchPost();
	}, [id]);

	const deleteUser = async () => {
		var myHeaders = new Headers();
		myHeaders.append('Authorization', auth0token);

		var requestOptions = {
			method: 'DELETE',
			headers: myHeaders,
			redirect: 'follow',
		};

		fetch(
			`https://${auth0domain}/api/v2/users/${postDetails.Owner}`,
			requestOptions
		)
			.then((response) => response.text())
			.then(() => {
				fetch(`${url}/api/user/${postDetails.Owner}`, {
					method: 'DELETE',
				});
				window.location.href = '/';
			})
			.catch((error) => console.log('error', error));
	};
	return (
		postDetails && (
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
						width: {
							md: '60vw',
						},
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-around',
						padding: '20px',
						boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
						borderRadius: '8px',
						backgroundColor: '#f9f9f9',
						gap: '10px',
						height: 'fit-content',
					}}
				>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#ececec',
							borderRadius: '4px',
						}}
					>
						{
							<img
								src={
									postDetails?.Image
										? postDetails.Image
										: 'https://webmail.ceng.metu.edu.tr/images/ceng-logo.png'
								}
								alt='item'
								style={{ maxWidth: '100%', maxHeight: '100%' }}
							/>
						}
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
					{currentUser.user_metadata?.name ===
						postDetails.OwnerName && (
						<Box
							sx={{
								display: 'flex',
								gap: '10px',
								alignSelf: 'end',
							}}
						>
							<Link to={`/edit/${id}`}>
								<Button variant='contained'>Edit</Button>
							</Link>
							<Button
								onClick={() => {
									fetch(`${url}/api/item/${id}`, {
										method: 'DELETE',
									});
									window.location.href = '/';
								}}
								variant='contained'
							>
								Delete
							</Button>
						</Box>
					)}
				</Box>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '20px',
						width: {
							md: '40vw',
						},
					}}
				>
					<Box
						key={postDetails.Owner}
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
						<Typography variant='body1'>
							{postDetails.OwnerName}
						</Typography>
						{!isProfilePublic || isUserAdmin ? (
							<>
								{allUsers.map((user) => {
									if (
										user.user_id === postDetails.Owner &&
										user.user_metadata
									) {
										return (
											<Box
												key={user.id}
												style={{ marginBottom: '10px' }}
											>
												{(currentUser?.user_id ||
													isProfilePublic) && (
													<>
														<Typography variant='body1'>
															{user.email}
														</Typography>
														<Typography variant='body1'>
															{
																user
																	.user_metadata
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
							</>
						) : (
							<Box
								key={postDetails.Owner}
								style={{ marginBottom: '10px' }}
							>
								<Typography variant='body1'>
									{postDetails.OwnerEmail}
								</Typography>
								<Typography variant='body1'>
									{postDetails.OwnerPhone}
								</Typography>
							</Box>
						)}
						<>
							{isUserAdmin ? (
								<Button
									variant='contained'
									onClick={deleteUser}
								>
									Delete User
								</Button>
							) : null}
						</>
					</Box>
					{postDetails?.Attributes && (
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
										boxShadow:
											'0 2px 4px rgba(0, 0, 0, 0.05)',
									}}
								>
									<thead>
										<tr
											style={{
												backgroundColor: '#f0f0f0',
											}}
										>
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
												{/*postdetails.Attributes[key] might be another object
												in that case recursively render the object to the end of its depth*/}
												{typeof postDetails.Attributes[
													key
												] === 'object'
													? Object.keys(
															postDetails
																.Attributes[key]
													  ).map((subKey) => (
															<table
																key={subKey}
																style={{
																	border: '1px solid #ddd',
																	borderCollapse:
																		'collapse',
																	width: '100%',
																	marginBottom:
																		'10px',
																	marginLeft:
																		'auto',
																	marginRight:
																		'auto',
																	backgroundColor:
																		'#fafafa',
																	boxShadow:
																		'0 2px 4px rgba(0, 0, 0, 0.05)',
																}}
															>
																<thead>
																	<tr
																		style={{
																			backgroundColor:
																				'#f0f0f0',
																		}}
																	>
																		<th
																			style={{
																				textAlign:
																					'left',
																				padding:
																					'8px',
																			}}
																		>
																			{subKey[0].toUpperCase() +
																				subKey.slice(
																					1
																				)}
																		</th>
																	</tr>
																</thead>
																<tbody>
																	<tr>
																		<td
																			style={{
																				textAlign:
																					'left',
																				padding:
																					'8px',
																			}}
																		>
																			{
																				postDetails
																					.Attributes[
																					key
																				][
																					subKey
																				]
																			}
																		</td>
																	</tr>
																</tbody>
															</table>
													  ))
													: postDetails.Attributes[
															key
													  ]}
											</td>
										</tr>
									</tbody>
								</table>
							))}
						</Box>
					)}
				</Box>
			</Box>
		)
	);
};

export default PostDetails;
