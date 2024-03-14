/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Post from './Post';
import Pagination from '@mui/material/Pagination';
import CategorySelector from './CategorySelector';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;

const Content = ({ userRole, currentUser }) => {
	const [items, setItems] = useState([]);
	const [page, setPage] = useState(1);
	const [category, setCategory] = useState('');

	useEffect(() => {
		const fetchAll = async () => {
			const response = await fetch(url + '/api/items/' + category);
			const data = await response.json();
			setItems(data);
		};

		fetchAll();
	}, [userRole, category]);
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '80vh',
			}}
		>
			<CategorySelector
				category={category}
				handleCategoryChange={setCategory}
			/>
			{items.slice((page - 1) * 10, (page - 1) * 10 + 10).map((item) => (
				<Post post={item} key={item.id} currentUser={currentUser} />
			))}

			<Pagination
				onChange={(event, value) => setPage(value)}
				count={
					Math.floor(items.length / 10) +
					(items.length % 10 === 0 ? 0 : 1)
				}
				sx={{
					margin: 'auto',
				}}
			/>
		</Box>
	);
};

export default Content;
