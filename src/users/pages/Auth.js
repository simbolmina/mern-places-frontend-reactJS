import { Fragment, useContext, useState } from 'react';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './Auth.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const Auth = props => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const auth = useContext(AuthContext);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
          //   confirmPassword: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
          //   confirmPassword: {
          //     value: '',
          //     isValid: false,
          //   },
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  // const loginSubmitHandler = async event => {
  //   event.preventDefault();

  //   if (isLoginMode) {
  //     try {
  //       setIsLoading(false);

  //       const response = await fetch('http://localhost:5000/api/users/login', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           email: formState.inputs.email.value,
  //           password: formState.inputs.password.value,
  //         }),
  //       });
  //       const responseData = await response.json();
  //       if (!response.ok) {
  //         throw new Error(responseData.message);
  //       }
  //       // console.log(responseData);
  //       setIsLoading(false);
  //       auth.login();
  //     } catch (err) {
  //       setIsLoading(false);
  //       setError(err.message || 'Something went wrong, try again');
  //     }
  //   } else {
  //     try {
  //       setIsLoading(true);

  //       const response = await fetch('http://localhost:5000/api/users/signup', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           name: formState.inputs.name.value,
  //           email: formState.inputs.email.value,
  //           password: formState.inputs.password.value,
  //         }),
  //       });
  //       const responseData = await response.json();
  //       if (!response.ok) {
  //         throw new Error(responseData.message);
  //       }
  //       // console.log(responseData);
  //       setIsLoading(false);
  //       auth.login();
  //     } catch (err) {
  //       setIsLoading(false);
  //       setError(err.message || 'Something went wrong, try again');
  //     }
  //   }
  // };

  // const errorHandler = () => {
  //   setError(null);
  // };

  const loginSubmitHandler = async event => {
    event.preventDefault();

    // console.log(formState.inputs);

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        // const responseData = await sendRequest(
        //   'http://localhost:5000/api/users/signup',
        //   'POST',
        //   JSON.stringify({
        //     name: formState.inputs.name.value,
        //     email: formState.inputs.email.value,
        //     password: formState.inputs.password.value,
        //   }),
        //   {
        //     'Content-Type': 'application/json',
        //   }
        // );

        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          formData
        );

        // console.log(formData);

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2> Login Required</h2>
        <hr />
        <form onSubmit={loginSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="name"
              label="Name"
              errorText="Please enter a valid name"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please select an image"
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            errorText="Please enter a valid email address"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            errorText="Please enter a valid password with at least 6 chars"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
          />
          {/* {!isLoginMode && (
          <Input
            id="confirmPassword"
            element="input"
            type="password"
            label="Confirm Password"
            errorText="Please enter the same  password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
          />
        )} */}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}
        </Button>
      </Card>
    </Fragment>
  );
};

export default Auth;
