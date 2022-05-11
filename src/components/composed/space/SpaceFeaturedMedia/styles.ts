import { styled } from '@mui/system';

interface WrapperProps {
  src?: string;
}

export const Wrapper = styled(`div`, {
  shouldForwardProp: (prop) => prop !== `src`,
})<WrapperProps>(({ src }) => ({
  minHeight: 390,
  background: `url('${src}')`,
  backgroundSize: `cover`,
}));
