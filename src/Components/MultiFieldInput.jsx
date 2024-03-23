/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const MultiFieldInput = ({ field, setPostData, attributeTree, isEdit }) => {
	const [newFields, setNewFields] = useState([]);
	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				gap: '10px',
				flexDirection: 'column',
			}}
		>
			{isEdit && attributeTree ? (
				<>
					<Typography variant='h5' style={{ marginBottom: '10px' }}>
						Attribute: {field}
					</Typography>
					{Object.keys(attributeTree).map((key) => {
						return (
							<TextField
								key={key}
								name={key}
								label={key}
								defaultValue={attributeTree[key]}
								onChange={(e) => {
									setPostData((prev) => {
										console.log(prev.Attributes);
										return {
											...prev,
											Attributes: {
												...prev?.['Attributes'],
												[field]: {
													...prev?.['Attributes']?.[
														field
													],
													[key]: e.target.value,
												},
											},
										};
									});
								}}
							/>
						);
					})}
					<Box sx={{ display: 'flex', gap: '10px' }}>
						<Button
							variant='contained'
							onClick={() => {
								const fieldName = prompt(
									'Enter the field name'
								);
								if (fieldName === null) return;
								setNewFields([...newFields, fieldName]);
								// trigger attributeTree update
								setPostData((prev) => {
									return {
										...prev,
										Attributes: {
											...prev?.['Attributes'],
											[field]: {
												...prev?.['Attributes']?.[
													field
												],
												[fieldName]: '',
											},
										},
									};
								});
							}}
						>
							Add new Field
						</Button>
					</Box>

					<Typography variant='h5' style={{ marginBottom: '10px' }}>
						----
					</Typography>
				</>
			) : (
				<>
					<Box sx={{ display: 'flex', gap: '10px' }}>
						<Button
							variant='contained'
							onClick={() => {
								const fieldName = prompt(
									'Enter the field name'
								);
								setNewFields([...newFields, fieldName]);
							}}
						>
							Add new Field
						</Button>
					</Box>
					<Typography variant='h5' style={{ marginBottom: '10px' }}>
						Attribute: {field}
					</Typography>
					{newFields.map((newField) => (
						<TextField
							key={newField}
							name={newField}
							label={newField}
							onChange={(e) => {
								setPostData((prev) => {
									return {
										...prev,
										Attributes: {
											...prev?.['Attributes'],
											[field]: {
												...prev?.['Attributes']?.[
													field
												],
												[newField]: e.target.value,
											},
										},
									};
								});
							}}
						/>
					))}
				</>
			)}
		</Box>
	);
};

export default MultiFieldInput;
