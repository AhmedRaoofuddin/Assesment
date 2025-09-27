import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const buttonClasses = cn(
      'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed',
      {
        'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg focus:ring-red-500 active:bg-red-800': variant === 'primary',
        'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md focus:ring-gray-500 border border-gray-200': variant === 'secondary',
        'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500': variant === 'outline',
      },
      {
        'h-10 px-4 text-sm': size === 'sm',
        'h-12 px-6 py-3 text-base': size === 'md',
        'h-14 px-8 text-lg': size === 'lg',
      },
      className
    );

    // Note: asChild functionality disabled for now to avoid TypeScript issues

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
