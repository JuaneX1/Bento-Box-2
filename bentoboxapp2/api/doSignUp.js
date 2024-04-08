export async function doSignUp(formData) {
    const PRODUCTION = true;
    const app_name = 'bento-box-mobile-c040aef8aea0'; 

    const instance = axios.create({
        baseURL: 'https://bento-box-3-c00801a6c9a4.herokuapp.com/api',
      });

    try {
       

        /*const response = await fetch(buildPath('api/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });*/

        const response = await instance.post(`/register`, formData);

        if (response.ok) {
            console.log('Signup success!');
            const { token } = response.data; // Assuming the server responds with a token
            await AsyncStorage.setItem('token', token.token);
            return token.token;
        } else {
            console.error('Failed to sign up:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: 'An error occurred' };
    }
}

function buildPath(route) {
    const PRODUCTION = true;
    //const app_name = 'bento-box-mobile-c040aef8aea0'; // Replace with your actual app name
    const app_name = 'bento-box-2-df32a7e90651';
    
    if (PRODUCTION) {
        console.log('production');
        return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
        console.log('local');
        return 'http://localhost:5000/' + route;
    }
}
