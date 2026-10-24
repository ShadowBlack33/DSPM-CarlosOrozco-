import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

const Register = () => (
  <AuthLayout back title={<>Crea tu<br />cuenta.</>} subtitle="Tus contactos y tareas quedan guardados solo para ti.">
    <AuthForm mode="register" />
  </AuthLayout>
);

export default Register;
