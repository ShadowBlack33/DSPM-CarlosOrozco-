import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

const Register = () => (
  <AuthLayout back title={<>Empieza<br />tu lista.</>} subtitle="Crea una cuenta y tus tareas quedan guardadas solo para ti.">
    <AuthForm mode="register" />
  </AuthLayout>
);

export default Register;
