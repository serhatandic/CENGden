/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Post from './Post';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
// const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}`;

const FavoriteList = ({ currentUser }) => {
	const [userFavorites, setUserFavorites] = useState([]);
	useEffect(() => {
		const fetchUserFavorites = async () => {
			const favorites = await fetch(
				`${url}/api/items/user/${currentUser.user_id}/favorites`
			);
			const data = await favorites.json();

			setUserFavorites([]);
			const tmp = [];
			for (let i = 0; i < data.length; i++) {
				const post = await fetch(`${url}/api/item/${data[i]}`);
				const result = await post.json();
				const postData = result['result'];
				tmp.push(postData);
			}
			setUserFavorites(tmp);
		};
		fetchUserFavorites();
	}, [currentUser]);

	return (
		<Box
			sx={{
				marginTop: '10vh',
			}}
		>
			{userFavorites.map((post) => {

				if (post) {
					return (
						<Post
							key={post._id}
							post={post}
							currentUser={currentUser}
						/>
					);
				}
			})}
		</Box>
	);
};

export default FavoriteList;
