import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function EmptySkillsState() {
  return (
    <Card className="border-2 border-dashed border-muted bg-transparent">
      <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2 font-mono">
            Sua mochila está vazia
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Explore a Taverna para coletar suas primeiras habilidades técnicas e ganhar XP!
          </p>
        </div>
        <Link href="/taverna">
          <Button 
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Ir para Taverna
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
