import { Card, CardContent } from '@/components/ui/card';
import { AcquiredSkill } from '@/lib/types';
import * as LucideIcons from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sword: LucideIcons.Sword,
  Shield: LucideIcons.Shield,
  Zap: LucideIcons.Zap,
  Code: LucideIcons.Code,
  Database: LucideIcons.Database,
  Package: LucideIcons.Package,
  Terminal: LucideIcons.Terminal,
  GitBranch: LucideIcons.GitBranch,
  Cpu: LucideIcons.Cpu,
  Layout: LucideIcons.Layout,
  Server: LucideIcons.Server,
  Lock: LucideIcons.Lock,
  Palette: LucideIcons.Palette,
  Gauge: LucideIcons.Gauge,
  Send: LucideIcons.Send,
  BookOpen: LucideIcons.BookOpen,
};

interface SkillCardProps {
  skill: AcquiredSkill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const IconComponent = iconMap[skill.icon_name] || LucideIcons.Sparkles;

  return (
    <Card className="bg-card/50 border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-6">
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {skill.name}
          </p>
          <p className="text-xs text-primary mt-1">
            +{skill.xp_points} XP
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
