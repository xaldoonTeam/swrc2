import React from 'react';
import { Users, GraduationCap, Lightbulb, Briefcase, HeartHandshake, Rocket } from 'lucide-react';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const iconMap: Record<string, IconComponent> = {
  Users,
  GraduationCap,
  Lightbulb,
  Briefcase,
  HeartHandshake,
  Rocket,
};

export function getProgramIcon(name: string | null | undefined): IconComponent {
  if (!name) return Users;
  return iconMap[name] ?? Users;
}
