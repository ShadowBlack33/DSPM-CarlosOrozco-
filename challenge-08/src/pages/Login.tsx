import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

const Login = () => (
  <AuthLayout title={<>Tus tareas,<br />con foto.</>} subtitle="Entra y ve cómo se actualizan en vivo.">
    <AuthForm mode="login" />
  </AuthLayout>
);

export default Login;
