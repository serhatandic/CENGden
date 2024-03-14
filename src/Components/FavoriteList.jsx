/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Post from './Post';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;

const FavoriteList = ({ currentUser }) => {
	const [userFavorites, setUserFavorites] = useState([]);
	useEffect(() => {
		const fetchUserFavorites = async () => {
			const favorites = await fetch(
				`${url}/api/items/user/${currentUser.user_id}/favorites`
			);
			const data = await favorites.json();
			setUserFavorites([]);
			for (let i = 0; i < data.length; i++) {
				const post = await fetch(`${url}/api/item/${data[i]}`);
				const postData = await post.json();
				setUserFavorites((prev) => [...prev, postData]);
			}
		};
		fetchUserFavorites();
	}, [currentUser]);

	return (
		<Box
			sx={{
				marginTop: '10vh',
			}}
		>
			{userFavorites
				? userFavorites.map((post) => {
						return (
							<Post
								key={post._id}
								post={post}
								currentUser={currentUser}
							/>
						);
				  })
				: null}
		</Box>
	);
};

export default FavoriteList;
