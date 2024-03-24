/* eslint-disable react/prop-types */
import { Box, TextField } from '@mui/material';
import MultiFieldInput from './MultiFieldInput';
import { useEffect } from 'react';

const TextFieldWrapper = ({
	field,
	setPostData,
	setMultiDictionary,
	multiDictionary,
	postData,
	handleChange,
}) => {
	useEffect(() => {
		if (typeof postData?.['Attributes']?.[field] === 'object') {
			setMultiDictionary((prev) => {
				return {
					...prev,
					[field]: 'multi',
				};
			});
		}
	}, [postData, field, setMultiDictionary]);
	return (
		<Box
			key={field}
			sx={{
				display: 'flex',
				gap: '10px',
			}}
		>
			{!(
				field === 'Title' ||
				field === 'Price' ||
				field === 'Description' ||
				field === 'Status'
			) ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<label htmlFor={field}>Multi</label>
					<input
						checked={multiDictionary[field] === 'multi'}
						onChange={(e) => {
							// reset state
							setPostData((prev) => {
								const oldAttributes = prev.Attributes;
								if (oldAttributes?.[field]) {
									delete oldAttributes[field];
								}

								return {
									...prev,
									Attributes: {
										...oldAttributes,
									},
								};
							});
							setMultiDictionary({
								...multiDictionary,
								[field]: e.target.checked ? 'multi' : 'single',
							});
						}}
						type='checkbox'
						id={field}
					/>
				</Box>
			) : null}
			{multiDictionary[field] === 'multi' ? (
				<MultiFieldInput
					field={field}
					setPostData={setPostData}
					attributeTree={postData?.Attributes?.[field]}
					isEdit={true}
				/>
			) : (
				<TextField
					type={field === 'Price' ? 'number' : 'text'}
					key={field}
					name={field}
					label={field}
					fullWidth
					onChange={handleChange}
					required={
						field === 'Title' ||
						field === 'Price' ||
						field === 'Description'
					}
					defaultValue={
						field === 'Title' ||
						field === 'Price' ||
						field === 'Description'
							? postData[field]
							: postData?.Attributes?.[field]
					}
				/>
			)}
		</Box>
	);
};

export default TextFieldWrapper;
