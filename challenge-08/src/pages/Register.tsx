import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

const Register = () => (
  <AuthLayout back title={<>Crea tu<br />cuenta.</>} subtitle="Tus tareas y fotos quedan protegidas: solo tú puedes verlas.">
    <AuthForm mode="register" />
  </AuthLayout>
);

export default Register;
