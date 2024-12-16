// import ForgetPassword from './pages/forgetPassword'
// import NewPassword from './pages/newPassword'
import Login from './pages/login'
import Landing from './pages/landing'
import Layout from './components/layout'
import NotFoud from './pages/NotFound'
import Dashboard from './pages/dashboard'
import Guidlines  from './pages/guidlines'
import Audit from './pages/audit'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import fetchCsrfToken from './utils/fetchCRSF'
import { connect, ConnectedProps } from 'react-redux';
import { checkLoggedIn } from './redux/slices/authSlice';
import { stateType } from './redux/store'
import { SyncLoader } from 'react-spinners';
import ProtectRoute from './utils/protectRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css'


const mapStateToProps = (state: stateType) => ({
  loading: state.auth.loading,
});

const mapDispatch = {
  checkLoggedIn,
};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

function App({ loading, checkLoggedIn  }:PropsFromRedux) {
  const queryClient = new QueryClient();

  
  useEffect(() => {
    if (document.cookie === "") {
      fetchCsrfToken();
    }

  }, []);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <h3>LOADING</h3>
        <SyncLoader color="#134e9d" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path='account-access' element={<Login />} />
        {/* <Route path='password-recovery' element={<ForgetPassword />} /> */}
        {/* <Route path="password-reset/:token" element={<NewPassword />} /> */}
        <Route element-={<ProtectRoute/>}>
          <Route path='dashboard' element={<Dashboard />} />
        </Route>
        <Route path='audit' element={<Audit />} />
        <Route path='guides' element={<Guidlines />} />
        <Route path='*' element={<NotFoud />} />
      </Route>
    </Routes>
    </QueryClientProvider>
  )
}



export default connector(App);

