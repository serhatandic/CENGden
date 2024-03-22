/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import UserPostList from './UserPostList';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

const auth0domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0token = import.meta.env.VITE_AUTH0_TOKEN;

const Profile = ({ user }) => {
	const [editMode, setEditMode] = useState(false);
	const [email, setEmail] = useState(user?.email);
	const [name, setName] = useState(user?.user_metadata?.name);
	const [phone, setPhone] = useState(user?.user_metadata?.phone_number);
	useEffect(() => {
		setEmail(user?.email);
		setName(user?.user_metadata?.name);
		setPhone(user?.user_metadata?.phone_number);
	}, [user]);

	const updateProfile = async () => {
		const url = `https://${auth0domain}/api/v2/users/${user.user_id}`;
		const data = {
			// User fields you want to update
			user_metadata: { phone_number: phone, name: name },
			email: email,
			// Any other user profile attributes according to the Auth0 documentation
		};
		const response = await fetch(url, {
			method: 'PATCH', // Use PATCH to update an existing resource
			headers: {
				Authorization: auth0token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
		});

		if (response.ok) {
			await response.json();
		} else {
			// Handle errors or unsuccessful updates
			console.error('Error updating user:', await response.text());
		}
	};
	return (
		<>
			{user && user.user_metadata ? (
				<>
					<Box
						sx={{
							marginTop: '10vh',
							border: '1px solid black',
							padding: '20px',
							borderRadius: '5px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '10px',
							}}
						>
							<TextField
								label='Name'
								defaultValue={user.user_metadata.name}
								disabled={!editMode}
								onChange={(e) => setName(e.target.value)}
							></TextField>
							<TextField
								label='Email'
								defaultValue={user.email}
								disabled={!editMode}
								onChange={(e) => setEmail(e.target.value)}
							></TextField>
							<TextField
								label='Phone Number'
								defaultValue={user.user_metadata.phone_number}
								disabled={!editMode}
								onChange={(e) => setPhone(e.target.value)}
							></TextField>
						</Box>
						{!editMode ? (
							<Button
								onClick={() => setEditMode(true)}
								variant='outlined'
							>
								Edit Profile
							</Button>
						) : (
							<Button
								onClick={() => {
									updateProfile();
									setEditMode(false);
								}}
								variant='contained'
							>
								Save
							</Button>
						)}
					</Box>
					<UserPostList currentUser={user} />
				</>
			) : null}
		</>
	);
};

export default Profile;
