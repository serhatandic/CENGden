import Box from '@mui/material/Box';
import Navbar from './Components/Navbar';
import Content from './Components/Content';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostDetails from './Components/PostDetails';
import AddPost from './Components/AddPost';
import Profile from './Components/Profile';
import EditPost from './Components/EditPost';
import UserPostList from './Components/UserPostList';
import FavoriteList from './Components/FavoriteList';

function App() {
	const [userRole, setUserRole] = useState('regular'); // regular, user, admin
	const [allUsers, setAllUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState({});

	return (
		<BrowserRouter>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Navbar
					setUserRole={setUserRole}
					userRole={userRole}
					setAllUsers={setAllUsers}
					setCurrentUser={setCurrentUser}
				/>
				<Box sx={{ width: '80vw', marginLeft: '10vw' }}>
					<Routes>
						<Route
							path='/'
							element={
								<Content
									userRole={userRole}
									currentUser={currentUser}
								/>
							}
						/>
						<Route
							path='/post/:id'
							element={<PostDetails allUsers={allUsers} />}
						/>
						<Route
							path='/add'
							element={
								<AddPost
									userRole={userRole}
									currentUser={currentUser}
								/>
							}
						/>
						<Route
							path='/profile'
							element={<Profile user={currentUser} />}
						/>
						<Route
							path='/edit/:id'
							element={
								<EditPost
									currentUser={currentUser}
									allUsers={allUsers}
								/>
							}
						/>
						<Route
							path='/posts'
							element={<UserPostList currentUser={currentUser} />}
						/>
						<Route
							path='/favorites'
							element={<FavoriteList currentUser={currentUser} />}
						/>
					</Routes>
				</Box>
			</Box>
		</BrowserRouter>
	);
}

export default App;
