import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { instance } from '../../App';

const Verify = ( ) => {
	const { token } = useParams();
	const navigate = useNavigate();
	let ignore = false;

	useEffect(() => {
		
		async function verify() {
			if (!ignore) {
				try {
					await instance.post(`/verify/${token}`);
					navigate('/?action=verified');
				} catch (error) {
					//do nothing yet
				}
			}
		}
		verify();
		
		return () => {
			ignore = true;
		};
	}, [token, navigate]);

	return (
		<div>
			{/* Render loading spinner or message while verifying */}
		</div>
	);
}

export default Verify;