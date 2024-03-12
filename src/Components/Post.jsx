/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Post = ({ post }) => {
	return (
		<Box
			sx={{
				padding: '25px',
				// light black
				backgroundColor: '#050505',
				margin: '50px',
				borderRadius: '5px',
			}}
		>
			<h1>{post.title}</h1>
			<p>{post.description}</p>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography
					sx={{
						font: 'normal bold 16px/1 Arial, sans-serif',
					}}
				>
					{post.category}{' '}
				</Typography>
				<Button color='inherit' variant='outlined'>
					Read more
				</Button>
			</Box>
		</Box>
	);
};

export default Post;
