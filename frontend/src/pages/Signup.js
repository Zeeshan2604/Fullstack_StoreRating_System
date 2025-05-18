import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from '../services/api';

const Signup = () => {
  const navigate = useNavigate();

  const signupSchema = Yup.object().shape({
    name: Yup.string().min(20).max(60).required(),
    email: Yup.string().email().required(),
    password: Yup.string()
      .matches(/^(?=.*[A-Z])(?=.*\W).{8,16}$/, '8-16 chars, 1 uppercase, 1 special char')
      .required(),
    address: Yup.string().max(400).required(),
  });

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      await API.post('/auth/signup', { ...values, role: 'user' });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <Formik
        initialValues={{ name: '', email: '', address: '', password: '' }}
        validationSchema={signupSchema}
        onSubmit={handleSignup}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Name:</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label>Email:</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label>Address:</label>
              <Field name="address" type="text" />
              <ErrorMessage name="address" component="div" />
            </div>
            <div>
              <label>Password:</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>Signup</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
