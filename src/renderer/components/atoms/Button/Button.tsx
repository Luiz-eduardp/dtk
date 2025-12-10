import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

/**
 * Atom: Button
 * Botão customizado com glassmorphism
 */
interface ButtonProps extends MuiButtonProps {
  children?: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
}

export function Button({ variant = 'contained', ...props }: ButtonProps) {
  return <MuiButton variant={variant} {...props} />;
}
