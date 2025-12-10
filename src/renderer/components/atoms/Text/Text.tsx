import { Typography, TypographyProps } from '@mui/material';

/**
 * Atom: Text
 * Tipografia reutilizável com variantes
 */
interface TextProps extends TypographyProps {
  children?: React.ReactNode;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button';
}

export function Text({ variant = 'body1', ...props }: TextProps) {
  return <Typography variant={variant} {...props} />;
}
