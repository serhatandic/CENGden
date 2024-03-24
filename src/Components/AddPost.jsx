/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button, Box } from '@mui/material';
import CategorySelector from './CategorySelector';
import TextFieldWrapper from './TextFieldWrapper';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
// const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}`;

const AddPost = ({ userRole, currentUser }) => {
	const [category, setCategory] = useState('');
	const [multiDictionary, setMultiDictionary] = useState({});
	const [postData, setPostData] = useState({
		Owner: currentUser?.user_id,
	});
	const handleCategoryChange = (category) => {
		setCategory(category);
		setPostData({}); // Reset form data when category changes
	};
	const [categories, setCategories] = useState({
		Vehicles: [
			'Title',
			'Price',
			'Description',
			'Type',
			'Brand',
			'Model',
			'Year',
			'Color',
			'Engine Displacement',
			'Fuel Type',
			'Transmission Type',
			'Mileage',
			'Image',
		],
		Computers: [
			'Title',
			'Price',
			'Description',
			'Type',
			'Brand',
			'Model',
			'Year',
			'Processor',
			'RAM',
			'Storage',
			'Graphics Card',
			'Operating System',
			'Image',
		],
		Phones: [
			'Title',
			'Price',
			'Description',
			'Brand',
			'Model',
			'Year',
			'Operating System',
			'Processor',
			'RAM',
			'Storage',
			'Camera Specifications',
			'Battery Capacity',
			'Image',
		],
		'Private Lessons': [
			'Title',
			'Price',
			'Description',
			'Tutor Name',
			'Lessons',
			'Location',
			'Duration',
			'Image',
		],
	});

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
	const handleImageUpload = async (e) => {
		// store the image as base64
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			setPostData({ ...postData, Image: reader.result });
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// add post owner data
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
						OwnerName: currentUser.user_metadata.name,
						OwnerEmail: currentUser.email,
						OwnerPhone: currentUser.user_metadata.phone_number,
						createdAt: new Date(),
						Category: category,
						Status: 'active',
						...postData,
					}
				)
			),
		});
		window.location.href = '/';
	};

	if (!currentUser) {
		return <Box>Loading...</Box>;
	}
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
						{category ? (
							<>
								{categories[category].map((field) => {
									if (field === 'Image') {
										return (
											<input
												type='file'
												key={field}
												name={field}
												label={field}
												onChange={handleImageUpload}
											/>
										);
									} else
										return (
											<TextFieldWrapper
												key={field}
												field={field}
												handleChange={handleChange}
												setPostData={setPostData}
												setMultiDictionary={
													setMultiDictionary
												}
												multiDictionary={
													multiDictionary
												}
												postData={postData}
											/>
										);
								})}
								<Button
									variant='contained'
									onClick={() => {
										// prompt user to add new field
										const newField = prompt(
											'Enter the name of the new field'
										);
										setCategories({
											...categories,
											[category]: [
												...categories[category],
												newField,
											],
										});
									}}
								>
									Add New Field
								</Button>
							</>
						) : null}
						{category ? (
							<Button
								type='submit'
								variant='contained'
								color='primary'
							>
								Submit
							</Button>
						) : null}
					</Box>
				</form>
			)}
		</>
	);
};

export default AddPost;
