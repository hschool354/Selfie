export interface SocialButtonProps {
    icon: string;
    label: string;
    bgColor?: string;
    textColor?: string;
    onClick?: () => void;
    disabled?: boolean; 
    className?: string;
    isDark?: boolean;
}
  
  export interface AuthButtonProps {
    label: string;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    className?: string;
    isDark?: boolean;
  }