import React from 'react'
import { Link } from 'react-router-dom';

const LogoDash = () => {
  return (
    <Link to="/layout-dash/dashboard">
      <div className="flex items-center space-x-2">
        <img
          src="/logo-transparent-itself.png"
          alt="Trackify Logo"
          className="w-6 h-6"
        />
        <h1 className="text-2xl font-light m-0">
          TRACKIFY
        </h1>
      </div>
    </Link>
  )
}

export default LogoDash;