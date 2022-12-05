import React from 'react';
import Routes from './routes/routes';
import PsContextProvider from './context/PsContextProvider';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import axios from 'axios';
import { getLs, baseUrl } from './utils'
import { useMediaQuery } from 'react-responsive';
axios.defaults.baseURL = `${baseUrl}`;
axios.defaults.headers.common['Api-Token'] = getLs('admin_api') || '';
axios.defaults.headers.common['X-Requested-With'] = `XMLHttpRequest`;

function App() {
	const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  return (
	<PsContextProvider>
		{/*<Toaster 
			toastOptions={{
				style: {
				  borderRadius: '10px',
				  background: '#333',
				  color: '#fff',
				},
			}}
		/>*/}
		<Toaster
			toastOptions={{
				//duration: 100000,
				style: {
				  borderRadius: '10px',
				  background: '#333',
				  color: '#fff',
				},
			}}		
		>
			{(t) => (
				<ToastBar toast={t}>
				{({ icon, message }) => (
					<>
					{icon}
					{message}
					{t.type !== 'loading' && (
						<button 
							onClick={() => toast.dismiss(t.id)}
							style={{
								background: 'transparent',
								border: '0px',
								color: '#918f8f',
							}}
						>
							x
						</button>
					)}
					</>
				)}
				</ToastBar>
			)}
		</Toaster>
		<Routes isMobile={isMobile}/>
		<iframe title="mytitle" name="print_frame" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank"></iframe>
	</PsContextProvider>
  );
}

export default App;
