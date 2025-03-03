import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userRole = localStorage.getItem('userRole')

  if (!isAuthenticated || userRole !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
