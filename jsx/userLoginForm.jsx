var UserLoginForm = React.createClass({
    // Make the form to be "Controlled Components"
    // that is, making the React state be the "single source of truth"
    // See: https://facebook.github.io/react/docs/forms.html
    getInitialState: function() {

	return {
	    username: '',
	    password: ''
	};

	// Resolve error of "Cannot read property 'setState' of undefined"
	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
    },

    handleChange: function(event) {
	// Update React state when the form's input changes
	// For example, when user types 'a' into the password field
	// event.target.name = password, and event.target.value = a
	this.setState({
	    [event.target.name]: event.target.value
	});
    },

    handleSubmit: function(event) {
	console.log('User tried to log in: ' + this.state.username + '; ' + this.state.password);
	// Prevent broswer from sending a HTTP GET request with parameters
	// in form (and perhaps refreshing the page)
	event.preventDefault();

	// Connect to AWS Cognito to authenticate user
	var authenticationData = {
	    Username: this.state.username,
	    Password: this.state.password,
	};
	// var authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
	var authenticationDetails = new AuthenticationDetails(authenticationData);
	var poolData = {
	    UserPoolId: COGNITO_USER_POOL_ID,
	    ClientId: COGNITO_CLIENT_ID
	};
	var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
	var userData = {
	    Username: this.state.username,
	    Pool: userPool
	};
	var cognitoUser = new CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
	    onSuccess: function(result) {
		console.log('access token + ' + result.getAccessToken().getJwtToken());

		let awsLoginKey =
		    'cognito-idp.' + COGNITO_REGION + '.amazonaws.com/' +
		    COGNITO_USER_POOL_ID;
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
		    Logins: {
			// Change the key below according to the specific region your user pool is in.
			awsLoginKey: result.getIdToken().getJwtToken()
		    }
		});

		// Instantiate aws sdk service objects now that the credentials have been updated.
		// example: var s3 = new AWS.S3();
		alert("AWS Cognito user login successful!")
	    },

	    onFailure: function(err) {
		alert(err);
	    },
	});
    },

    render: function() {
	return (
	    <form onSubmit={this.handleSubmit}>
	      Username:
	      <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
	      Password:
	      <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
	      <input type="submit" value="Log In"/>
	    </form>
	);
    },

});

console.log('ReactDOM.render is called.');
ReactDOM.render( < UserSignupForm / > , document.getElementById('userlogin'));
