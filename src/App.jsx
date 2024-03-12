import Box from '@mui/material/Box';
import Navbar from './Components/Navbar';
import Content from './Components/Content';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostDetails from './Components/PostDetails';

function App() {
	const [userRole, setUserRole] = useState('regular'); // regular, user, admin

	return (
		<BrowserRouter>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Navbar setUserRole={setUserRole} userRole={userRole} />

				<Routes>
					<Route path='/' element={<Content userRole={userRole} />} />
					<Route path='/post/:id' element={<PostDetails />} />
				</Routes>
			</Box>
		</BrowserRouter>
	);
}

export default App;
