/* eslint-disable react/prop-types */
import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import CategorySelector from './CategorySelector';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;

const categories = {
	Vehicles: [
		'Title',
		'Type',
		'Brand',
		'Model',
		'Year',
		'Color',
		'Engine Displacement',
		'Fuel Type',
		'Transmission Type',
		'Mileage',
		'Price',
		'Image',
		'Description',
	],
	Computers: [
		'Title',
		'Type',
		'Brand',
		'Model',
		'Year',
		'Processor',
		'RAM',
		'Storage',
		'Graphics Card',
		'Operating System',
		'Price',
		'Image',
		'Description',
	],
	Phones: [
		'Title',
		'Brand',
		'Model',
		'Year',
		'Operating System',
		'Processor',
		'RAM',
		'Storage',
		'Camera Specifications',
		'Battery Capacity',
		'Price',
		'Image',
		'Description',
	],
	'Private Lessons': [
		'Title',
		'Tutor Name',
		'Lessons',
		'Location',
		'Duration',
		'Price',
		'Image',
		'Description',
	],
};

const AddPost = ({ userRole, currentUser }) => {
	const [category, setCategory] = useState('');
	const [postData, setPostData] = useState({
		Owner: currentUser.user_id,
	});
	const handleCategoryChange = (category) => {
		setCategory(category);
		setPostData({}); // Reset form data when category changes
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		switch (name) {
			case 'Title':
				setPostData({ ...postData, Title: value });
				break;
			case 'Price':
				setPostData({ ...postData, Price: value });
				break;
			case 'Description':
				setPostData({ ...postData, Description: value });
				break;
			case 'Image':
				setPostData({ ...postData, Image: value });
				break;
			default:
				setPostData({
					...postData,
					Attributes: { ...postData.Attributes, [name]: value },
				});
				break;
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		// add post owner data
		for (let i = 0; i < 100; i++) {
			await fetch(`${url}/api/items`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					Object.assign(
						{},
						{
							Owner: currentUser.user_id,
							createdAt: new Date(),
							Category: category,
							Status: 'active',
							...postData,
						}
					)
				),
			});
		}
		window.location.href = '/';
	};

	return (
		<>
			{userRole === 'regular' ? (
				<Box>You are not authorized to add a post</Box>
			) : (
				<form onSubmit={handleSubmit}>
					<Box
						sx={{
							display: 'flex',
							gap: '20px',
							flexDirection: 'column',
							marginTop: '10vh',
							marginBottom: '5vh',
						}}
					>
						<Box>
							<CategorySelector
								category={category}
								handleCategoryChange={handleCategoryChange}
							/>
						</Box>
						{category &&
							categories[category].map((field) => {
								return (
									<TextField
										key={field}
										name={field}
										label={field}
										fullWidth
										onChange={handleChange}
										required
									/>
								);
							})}
						<Button
							type='submit'
							variant='contained'
							color='primary'
						>
							Submit
						</Button>
					</Box>
				</form>
			)}
		</>
	);
};

export default AddPost;
