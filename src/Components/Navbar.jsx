/* eslint-disable react/prop-types */
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';

const auth0token = import.meta.env.VITE_AUTH0_TOKEN;
const auth0domain = import.meta.env.VITE_AUTH0_DOMAIN;
export default function Navbar({
	userRole,
	setUserRole,
	setAllUsers,
	setCurrentUser,
}) {
	const { user, isAuthenticated, isLoading } = useAuth0();

	useEffect(() => {
		if (isLoading || !isAuthenticated) {
			return;
		}
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
				let role = '';
				result.forEach((element) => {
					if (element.user_id === user.sub) {
						role = 'admin';
					}
				});

				if (role === '') {
					setUserRole('user');
				} else {
					setUserRole(role);
				}
			})
			.catch((error) => console.log('error', error));

		fetch(
			'https://dev-hbz8z1qco74m4737.us.auth0.com/api/v2/users',
			requestOptions
		)
			.then((response) => response.json())
			.then((result) => {
				setAllUsers(result);
				setCurrentUser(result.filter((u) => u.user_id === user.sub)[0]);
			});
	}, [
		user,
		isLoading,
		isAuthenticated,
		setUserRole,
		userRole,
		setAllUsers,
		setCurrentUser,
	]);

	return (
		<AppBar sx={{ height: '7vh' }}>
			<Toolbar
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<Button
					onClick={() => {
						window.location.href = '/';
					}}
					color='inherit'
				>
					CENGden
				</Button>

				<Box>
					{!isLoading && isAuthenticated && (
						<>
							<Button
								onClick={() => {
									window.location.href = '/favorites';
								}}
								color='inherit'
							>
								Favorites
							</Button>
							<Button
								color='inherit'
								onClick={() => {
									window.location.href = '/add';
								}}
							>
								Add Post
							</Button>
							<Button
								onClick={() => {
									window.location.href = '/profile';
								}}
								color='inherit'
								endIcon={
									<img
										src={user.picture}
										alt={user.name}
										style={{
											borderRadius: '50%',
											width: '30px',
											height: '30px',
										}}
									/>
								}
							>
								{user.profile}
							</Button>
						</>
					)}
					{!isAuthenticated && <LoginButton />}
					{isAuthenticated && <LogoutButton />}
				</Box>
			</Toolbar>
		</AppBar>
	);
}
