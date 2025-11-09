import { Badge } from '@aws-amplify/ui-react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Formbar } from '../sections/Formbar';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { CategoryBar } from '../sections/CategoryBar';
import { ContributionMap } from './heat-map';

interface StatsCardProps {
  title: string;
  value: string;
  delta: number;
  average: string;
  footer?:string|undefined;
  variant: 'light' | 'purple' | 'blue' | 'teal';
}

const variants = {
  light: {
    bg: 'bg-slate-600'
  },
  purple: {
    bg: 'bg-fuchsia-600'
  },
  blue: {
    bg: 'bg-blue-600'
  },
  teal: {
    bg: 'bg-teal-600'
  },
};

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  delta, 
  average, 
  footer,
  variant 
}) => {
  const variantStyles = variants[variant];

  return (
    <Card className={`relative overflow-hidden ${variantStyles.bg} border-none text-white w-120 h-60 sm:w-240 sm:h-120`}>
      <svg className="absolute right-0 top-0 w-24 h-24 sm:w-48 sm:h-48 pointer-events-none" viewBox="0 0 200 200" fill="none" style={{ zIndex: 0 }}>
            <defs>
                <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" />
                </filter>
            </defs>
            <polygon points="150,0 200,0 200,50" fill="#fff" fillOpacity="0.07" />
        </svg>
      <CardHeader className="border-0 z-10 relative pb-2">
        <CardTitle className="text-white/90 text-xl sm:text-3xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 z-10 relative flex flex-col justify-between h-full pt-0">
        <div className="flex items-center justify-center gap-3 w-full h-full">
          <span className="text-4xl sm:text-8xl font-bold tracking-tight">
            {value}
          </span>
          <Badge className="bg-white/20 font-semibold text-lg sm:text-2xl flex items-center gap-1">
            {delta > 0 ? <ArrowUp /> : <ArrowDown />}&nbsp;
            <span className='text-sm sm:text-xl'>{delta.toFixed(1)}</span>
          </Badge>

        </div>
        <div className="text-sm sm:text-xl text-white/80 border-t border-white/20 pt-3">
          vs {footer || 'average'}:{' '}
          <span className="font-medium text-white">
            {average}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
