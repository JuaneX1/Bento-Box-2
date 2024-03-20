export async function doSignUp(firstName, lastName, username, email, password) {
  
  const app_name = 'bento-box-mobile-c040aef8aea0'
  //const app_name = 'bento-box-3-c00801a6c9a4'
  
  // builds path if we local or if we are on heroku
  event.preventDefault();

  try {
    const response = await fetch(buildPath('api/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      onClose();
      navigate('/dashboard');
    } else {
      // Handle error response
      console.error('Failed to sign up');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  }
  
  function buildPath(route)
  {
      if (process.env.NODE_ENV === 'production')
      {
          return 'https://' + app_name + '.herokuapp.com/' + route;
      }
      else
      {
          return 'http://localhost:5000/' + route;
      }
  }