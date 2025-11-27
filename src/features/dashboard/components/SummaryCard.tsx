import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  number: string | number;
  description: string;
}

export const SummaryCard = (props: SummaryCardProps) => {
  const { title, icon, number, description } = props;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{number}</div>
        <p className="text-xs text-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
