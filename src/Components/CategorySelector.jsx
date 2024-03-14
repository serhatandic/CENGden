/* eslint-disable react/prop-types */
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const CategorySelector = ({ category, handleCategoryChange }) => {
	const handleChange = (event) => {
		const selectedCategory = event.target.value;
		handleCategoryChange(selectedCategory);
	};

	return (
		<FormControl fullWidth>
			<InputLabel id='category'>Category</InputLabel>
			<Select
				label='Category'
				labelId='category'
				value={category}
				onChange={handleChange}
			>
				<MenuItem value=''>None</MenuItem>
				<MenuItem value='Vehicles'>Vehicles</MenuItem>
				<MenuItem value='Computers'>Computers</MenuItem>
				<MenuItem value='Phones'>Phones</MenuItem>
				<MenuItem value='Private Lessons'>Private Lessons</MenuItem>
			</Select>
		</FormControl>
	);
};

export default CategorySelector;
