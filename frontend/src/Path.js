// builds path if we local or if we are on heroku
// comment and uncomment depending on where deploying on heroku
// if this is our produnction, use Bento box 2
// if this is our test, use Bento box 3

//const app_name = 'bento-box-2-df32a7e90651'
const app_name = 'bento-box-3-c00801a6c9a4'

exports.buildPath =
    function buildPath(route) {

        if (process.env.NODE_ENV === 'production') {

            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {

            return 'http://localhost:5000/' + route;
        }
    }
