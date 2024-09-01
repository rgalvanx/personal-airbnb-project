import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import AllSpots from './components/AllSpots/AllSpots';
import SpotDetail from './components/AllSpots/SpotDetail';
import AddSpot from './components/AddSpot/AddSpot';
import ManageSpot from './components/ManageSpot/ManageSpot'
import EditSpot from './components/EditSpot/EditSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <div className='spots_container'><AllSpots /></div>
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetail />
      },
      {
        path: '/spots/new',
        element: <AddSpot />
      },
      {
        path: '/spots/current',
        element: <ManageSpot />
      },
      {
        path: `/spots/:spotId/edit`,
        element: <EditSpot />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
