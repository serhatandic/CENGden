/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	TextField,
	Button,
	Box,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from '@mui/material';
// import sgMail from '@sendgrid/mail';
import sgMail from '@sendgrid/mail';

const bakcendIp = import.meta.env.VITE_BACKEND_IP;
const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}:${backendPort}`;
sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

const EditPost = ({ currentUser, allUsers }) => {
	const { id } = useParams();
	const [category, setCategory] = useState('Vehicles');
	const [postData, setPostData] = useState({});
	const [prevPrice, setPrevPrice] = useState(999999);
	const [favoritedBy, setFavoritedBy] = useState([]);
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
	useEffect(() => {
		fetch(`${url}/api/item/${id}`)
			.then((res) => res.json())
			.then((res) => {
				const data = res['result'];
				setPostData(data);
				setPrevPrice(data.Price);
				setCategory(data.Category);
			});

		fetch(`${url}/api/items/${id}/favoritedBy`)
			.then((res) => res.json())
			.then((data) => {
				setFavoritedBy(data);
			});
	}, [id, currentUser]);

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
			case 'Status':
				setPostData({ ...postData, Status: value });
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
		await fetch(`${url}/api/item/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				Object.assign(
					{},
					{
						Owner: currentUser.user_id,
						OwnerName: currentUser.user_metadata.name,
						createdAt: new Date(),
						Category: category,
						...postData,
					}
				)
			),
		});
		if (postData.Price < prevPrice) {
			allUsers.forEach(async (user) => {
				if (favoritedBy.includes(user.user_id)) {
					await fetch(
						`${url}/api/sendmail/${user.email}/${postData.Title}`,
						{
							method: 'POST',
						}
					);
				}
			});
		}
		window.location.href = '/post/' + id;
	};
	return (
		<div>
			{
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
						{category && postData && postData.Attributes ? (
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
									} else if (field === 'Status') {
										return (
											<FormControl key={field}>
												<InputLabel id='demo-simple-select-label'>
													Status
												</InputLabel>
												<Select
													type='text'
													key={field}
													name={field}
													label={field}
													fullWidth
													onChange={handleChange}
													defaultValue={
														postData[field]
													}
												>
													<MenuItem value={'active'}>
														active
													</MenuItem>
													<MenuItem
														value={'inactive'}
													>
														inactive
													</MenuItem>
												</Select>
											</FormControl>
										);
									} else
										return (
											<TextField
												type={
													field === 'Price'
														? 'number'
														: 'text'
												}
												key={field}
												name={field}
												label={field}
												fullWidth
												onChange={handleChange}
												required={
													field === 'Title' ||
													field === 'Price' ||
													field === 'Description' ||
													field === 'Status'
												}
												defaultValue={
													postData[field] ||
													postData.Attributes[field]
												}
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
						<Button
							type='submit'
							variant='contained'
							color='primary'
						>
							Submit
						</Button>
					</Box>
				</form>
			}
		</div>
	);
};

export default EditPost;
