
import './App.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './Dashboard';
import { ErrorBoundary } from 'react-error-boundary';

function App() {

  const queryClient = new QueryClient();




  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
