import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

const queryClient = new QueryClient()

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
				<ReactQueryDevtools
				// initialIsOpen
				// position="right"
				// buttonPosition="bottom-right"
				/>
			</QueryClientProvider>
		</Provider>
	</StrictMode>,
)
