import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import API from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const loginSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await API.post('/auth/login', values);
      localStorage.setItem('token', res.data.token);

      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'user') navigate('/user');
      else if (role === 'owner') navigate('/owner');
    } catch (err) {
      setErrors({ password: 'Invalid credentials' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-gray-600" htmlFor="email">Email:</label>
                <Field name="email" type="email" className="w-full border border-gray-300 p-2 rounded" />
                <ErrorMessage name="email" component="div" className="text-red-500 mt-1 text-sm" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600" htmlFor="password">Password:</label>
                <Field name="password" type="password" className="w-full border border-gray-300 p-2 rounded" />
                <ErrorMessage name="password" component="div" className="text-red-500 mt-1 text-sm" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
