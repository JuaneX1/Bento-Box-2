import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { instance } from './App';

const Verify = () => {
	const { objId } = useParams();
	const navigate = useNavigate();
	let ignore = false;

	useEffect(() => {
		
		async function verify() {
			console.log(ignore);
			if (!ignore) {
				try {
					await instance.get(`/verify/${objId}`);
					navigate('/');
				} catch (error) {
					//do nothing yet
				}
			}
		}
		verify();
		
		return () => {
			ignore = true;
		};
	}, [objId, navigate]);

	return (
		<div>
			{/* Render loading spinner or message while verifying */}
		</div>
	);
}

export default Verify;