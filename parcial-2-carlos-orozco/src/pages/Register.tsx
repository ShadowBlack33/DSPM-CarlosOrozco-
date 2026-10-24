import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';

const Register = () => (
  <AuthLayout title={<>Únete al<br />ranking.</>} subtitle="Crea tu cuenta y compite con usuarios reales.">
    <AuthForm mode="register" />
  </AuthLayout>
);

export default Register;
