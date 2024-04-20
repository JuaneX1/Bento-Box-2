import react, { useEffect } from 'react';
import { instance } from '../../App';

const Favorites = () => {
	let ignore = false;
	
	useEffect(() => {
		
		async function verify() {
			if (!ignore) {
				try {
					const token = sessionStorage.getItem('token');
					const favoritesArr = await instance.get(`/getFavorite`, { headers: { Authorization: sessionStorage.getItem('token') }});
					console.log(favoritesArr);
				} catch (error) {
					//do nothing yet
				}
			}
		}
		verify();
		
		return () => {
			ignore = true;
		};
	});
	
	return (<div> This is the favorites page </div>);
};

export default Favorites;