import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-[15px] text-claude-secondary mb-6 overflow-x-auto">
      <Link href="/library" className="flex items-center text-claude-primary hover:underline transition-colors duration-150">
        <Home size={16} />
      </Link>

      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight size={16} className="text-claude-secondary" />
          {index === items.length - 1 ? (
            <span className="font-medium text-black">{item.name}</span>
          ) : (
            <Link href={item.href} className="text-claude-primary hover:underline transition-colors duration-150">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
