import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

const Login = () => (
  <AuthLayout title={<>Completa misiones.<br />Gana puntos.</>} subtitle="Foto, movimiento y paciencia. Entra para seguir tu progreso.">
    <AuthForm mode="login" />
  </AuthLayout>
);

export default Login;
