import { Card, CardContent } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="border-border/80 shadow-xl shadow-primary/5">
      <CardContent className="p-8">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-6">{children}</div>
        {footer ? (
          <div className="mt-6 border-t pt-4 text-center text-sm">{footer}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
