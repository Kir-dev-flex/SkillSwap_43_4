import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export interface TertiaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}
