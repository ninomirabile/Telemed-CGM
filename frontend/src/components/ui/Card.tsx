import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  header,
  footer,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = [
    'medical-card',
    paddingClasses[padding],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {(title || subtitle || header) && (
        <div className="medical-card-header">
          {header || (
            <>
              {title && <h3 className="medical-card-title">{title}</h3>}
              {subtitle && <p className="medical-card-subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-neutral-200 pt-4 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
}; 