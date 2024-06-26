/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	Button,
	Box,
	FormControl,
	MenuItem,
	Select,
	InputLabel,
} from '@mui/material';
import TextFieldWrapper from './TextFieldWrapper';
const bakcendIp = import.meta.env.VITE_BACKEND_IP;
// const backendPort = import.meta.env.VITE_BACKEND_PORT;
const url = `${bakcendIp}`;
const auth0token = import.meta.env.VITE_AUTH0_TOKEN;
const auth0domain = import.meta.env.VITE_AUTH0_DOMAIN;

const EditPost = ({ currentUser, allUsers }) => {
	const { id } = useParams();
	const [category, setCategory] = useState('Vehicles');
	const [multiDictionary, setMultiDictionary] = useState({});
	const [postData, setPostData] = useState({});
	const [prevPrice, setPrevPrice] = useState(999999);
	const [favoritedBy, setFavoritedBy] = useState([]);
	const [loading, setLoading] = useState(true);
	const [adminUsers, setAdminUsers] = useState([]);

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
			'Status',
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
			'Status',
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
			'Status',
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
			'Status',
		],
	});
	useEffect(() => {
		setLoading(true);
		fetch(`${url}/api/item/${id}`)
			.then((res) => res.json())
			.then((res) => {
				const data = res['result'];
				setPostData(data);
				setPrevPrice(data.Price);
				setCategory(data.Category);
				setLoading(false);
			});

		fetch(`${url}/api/items/${id}/favoritedBy`)
			.then((res) => res.json())
			.then((data) => {
				setFavoritedBy(data);
			});
	}, [id, currentUser]);

	const isUserAdmin = adminUsers?.some(
		(user) => user.user_id === currentUser.user_id
	);
	useEffect(() => {
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
				setAdminUsers(result);
			})
			.catch((error) => console.log('error', error));
	}, []);

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
					Attributes: { ...postData?.Attributes, [name]: value },
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
						OwnerEmail: currentUser.email,
						OwnerPhone: currentUser.user_metadata.phone_number,
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
	if (loading) {
		return <div>Loading...</div>;
	}
	if (!isUserAdmin && postData?.Owner !== currentUser.user_id) {
		return <div>Unauthorized</div>;
	}
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
						{category && postData ? (
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
									} else if (
										field === 'Status' &&
										postData['Status']
									) {
										return (
											<FormControl key={Math.random()}>
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
														postData['Status']
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
									} else {
										return (
											<TextFieldWrapper
												key={field}
												field={field}
												setPostData={setPostData}
												postData={postData}
												handleChange={handleChange}
												multiDictionary={
													multiDictionary
												}
												setMultiDictionary={
													setMultiDictionary
												}
											/>
										);
									}
								})}
								<Button
									variant='contained'
									onClick={() => {
										// prompt user to add new field
										const newField = prompt(
											'Enter the name of the new field'
										);
										if (!newField) {
											return;
										}
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
