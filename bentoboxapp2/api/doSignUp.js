export async function doSignUp(firstName, lastName, username, email, password) {
    const PRODUCTION = true;
    const app_name = 'bento-box-mobile-c040aef8aea0'; 

    try {
        const formData = {
            first: firstName,
            last: lastName,
            login: username,
            email: email,
            password: password
        };

        const response = await fetch(buildPath('api/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log('Signup success!');
            return { success: true }; 
        } else {
            console.error('Failed to sign up:', response.status);
            return { success: false, error: 'Failed to sign up' }; 
        }
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error: 'An error occurred' };
    }
}

function buildPath(route) {
    const PRODUCTION = true;
    const app_name = 'bento-box-mobile-c040aef8aea0'; // Replace with your actual app name

    if (PRODUCTION) {
        console.log('production');
        return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
        console.log('local');
        return 'http://localhost:5000/' + route;
    }
}
