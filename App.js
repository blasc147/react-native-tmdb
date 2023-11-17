import AppNavigation from './navigation/appNavigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NativeWindStyleSheet } from 'nativewind'

NativeWindStyleSheet.setOutput({
  default: 'native'
})
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <AppNavigation />
    </QueryClientProvider>
  )
}
