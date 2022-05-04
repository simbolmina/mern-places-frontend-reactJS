import { Fragment, useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  // useEffect(() => {
  //   const sendRequest = async () => {
  //     setIsLoading(false);
  //     try {
  //       const response = await fetch('http://localhost:5000/api/users');

  //       const responseData = await response.json();

  //       if (!response.ok) {
  //         throw new Error(responseData.message);
  //       }

  //       setLoadedUsers(responseData.users);

  //       setIsLoading(false);
  //     } catch (err) {
  //       setIsLoading(false);
  //       setError(err.message);
  //     }
  //   };
  //   sendRequest();
  //   // eslint-disable-next-line
  // }, []);

  // const errorHandler = () => {
  //   setError(null);
  // };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </Fragment>
  );
};

export default Users;
