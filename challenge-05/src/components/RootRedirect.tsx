import useRedirectOnce from './useRedirectOnce';

const RootRedirect = ({ to }: { to: string }) => {
  useRedirectOnce(true, to);
  return null;
};

export default RootRedirect;
