import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

const Login = () => (
  <AuthLayout title={<>Tu lista,<br />en orden.</>} subtitle="Entra para ver y organizar tus tareas.">
    <AuthForm mode="login" />
  </AuthLayout>
);

export default Login;
