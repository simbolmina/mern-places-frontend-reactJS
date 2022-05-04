import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input';
import {
  // VALIDATOR_FILE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import Button from './../../shared/components/FormElements/Button';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { Fragment, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHistory } from 'react-router-dom';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    },
    address: {
      value: '',
      isValid: false,
    },
    image: {
      value: null,
      isValid: false,
    },
  });
  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('image', formState.inputs.image.value);
      // formData.append('creator', auth.userId);
      // await sendRequest(
      //   'http://localhost:5000/api/places',
      //   'POST',
      // JSON.stringify({
      //   title: formState.inputs.title.value,
      //   description: formState.inputs.description.value,
      //   address: formState.inputs.address.value,
      //   creator: auth.userId,
      // }),
      // {
      //   'Content-Type': 'application/json',
      // }
      // );

      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );

      //redirect the user different page
      history.push('/');
    } catch (err) {}
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText="Please enter a valid title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          errorText="Please enter a valid address"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          // type="text"
          label="Description"
          errorText="Please enter a valid description (min 5 char)"
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />
        {/* <Input
          id="image"
          element="input"
          type="file"
          errorText="Please select an image"
          validators={[VALIDATOR_FILE()]}
          onInput={inputHandler}
        /> */}
        <ImageUpload
          id="image"
          center
          onInput={inputHandler}
          errorText="Please select an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </Fragment>
  );
};

export default NewPlace;
