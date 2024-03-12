import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<Auth0Provider
		domain='dev-hbz8z1qco74m4737.us.auth0.com'
		clientId='mAXjAUI8xM5NzSVgH7CNrKLQ67swc48b'
		authorizationParams={{
			redirect_uri: window.location.origin,
		}}
		cacheLocation='localstorage'
	>
		<App />
	</Auth0Provider>
);
