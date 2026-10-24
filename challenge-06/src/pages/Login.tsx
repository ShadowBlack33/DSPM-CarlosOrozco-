import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

const Login = () => (
  <AuthLayout title={<>Contactos, tareas<br />y frutas.</>} subtitle="Entra para ver tus datos en la nube y en este dispositivo.">
    <AuthForm mode="login" />
  </AuthLayout>
);

export default Login;
