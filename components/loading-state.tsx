import { Spinner } from '@/components/ui/spinner';

export function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="text-center text-lg text-muted-foreground font-mono">
          Sincronizando com a Matrix...
        </p>
      </div>
    </div>
  );
}
