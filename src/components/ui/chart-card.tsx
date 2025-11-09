import { Formbar } from '../sections/Formbar';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { CategoryBar } from '../sections/CategoryBar';
import { ContributionMap } from './heat-map';

interface ChartCardProps {
  title: string;
  variant: 'formbar' | 'category-bar' | 'category-split' | 'contribution-map';
  data?: Array<any>|{[key:string]:number}|undefined
  footer?: string|undefined
  label?:string|undefined
  labels?:string[]
}

const variants = {
  'formbar': {
    bg: 'bg-slate-800'
  },
  'category-bar': {
    bg: 'bg-slate-300'
  },
  'category-split': {
    bg: 'bg-zinc-300'
  },
  'contribution-map': {
    bg: 'bg-blue-600'
  },
};

const ChartCard: React.FC<ChartCardProps> = ({ title, variant,data,footer,label,labels }) => {
  const variantStyles = variants[variant];
  const isLight = variant.includes('category');

  return (
    <Card className={`relative overflow-hidden ${variantStyles.bg} border-none ${isLight ? 'text-black' : 'text-white'} w-120 h-60 sm:w-240 sm:h-120`}>
      <svg className="absolute right-0 top-0 w-24 h-24 sm:w-48 sm:h-48 pointer-events-none" viewBox="0 0 200 200" fill="none" style={{ zIndex: 0 }}>
        <defs>
          <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <polygon points="150,0 200,0 200,50" fill={isLight ? "#000" : "#fff"} fillOpacity="0.07" />
      </svg>
      <CardHeader className="border-0 z-10 relative pb-2">
        <CardTitle className={`${isLight ? 'text-black/90' : 'text-white/90'} text-xl sm:text-3xl font-medium`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 z-10 relative flex flex-col justify-center h-full pt-0">
        <div className="flex items-center justify-center w-full h-full">
          {variant === "formbar" && <Formbar data={data as Array<{ type: 'win' | 'loss' | 'abort'; name: string }>}/>}
          {variant === "category-bar" && <CategoryBar
            values={(data as number[])!}
            labels={labels}
            marker={{ value: Math.max(...data as number[]), tooltip: label+":"+Math.max(...data as number[]), showAnimation: true }}
            colors={["pink", "amber", "emerald", "fuchsia"]}
            className="mx-auto max-w-screen w-100 sm:w-200 "
          />}
          {variant === "category-split" && <CategoryBar
            values={(data as number[])!}
            labels={labels?.map(a=>a.toUpperCase())}
            colors={["pink", "amber"]}
            className="mx-auto max-w-screen w-100 sm:w-200"
          />}
          {variant === "contribution-map" && !!data && <ContributionMap data={data as {[key:string]:number}} label={label}/>}
        </div>
        <div className={`text-sm sm:text-xl ${isLight ? 'text-black' : 'text-white/80'} border-t border-white/20 pt-3`}>
          {footer}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard