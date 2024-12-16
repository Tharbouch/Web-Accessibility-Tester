import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import { stateType } from '../redux/store';

const mapStateToProps = (state: stateType) => ({
  loggedIn: state.auth.loggedIn,
});

type ProtectedRouteProps = {
  loggedIn: boolean;
};

const ProtectedRoute = ({ loggedIn }:ProtectedRouteProps) => {
  return loggedIn ? <Outlet /> : <Navigate to="/account-access" replace />;
};

export default connect(mapStateToProps)(ProtectedRoute);