/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Post from './Post';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;

const Content = ({ userRole }) => {
	const [items, setItems] = useState([]);

	useEffect(() => {
		const fetchAll = async () => {
			const response = await fetch(url + '/api/items');
			const data = await response.json();
			setItems(data);
		};

		fetchAll();
	}, [userRole]);
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '93vh',
			}}
		>
			{items.map((item) => (
				<Post post={item} key={item.id} />
			))}
		</Box>
	);
};

export default Content;
