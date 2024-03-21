
const PRODUCTION = true;

export async function doLogin(formData, navigation){
    //route.preventDefault();
    if(formData.email == null || formData.password){
        try {
            
            const response = await fetch(buildPath('api/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {

                console.log(formData.email)
                console.log('login success!')
                navigation.navigate('Home');
            } else {
                // Handle incorrect login credentials
                console.error('Incorrect email or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    else{
        console.log("invalid input");
    }
}

function buildPath(route)
{
    const app_name = 'bento-box-mobile-c040aef8aea0'
    //const app_name = 'bento-box-3-c00801a6c9a4'
    
    // builds path if we local or if we are on heroku

    if (PRODUCTION)
    {
        console.log('production')
        return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else
    {
        console.log('local')
        return 'http://localhost:5000/' + route;
    }
}