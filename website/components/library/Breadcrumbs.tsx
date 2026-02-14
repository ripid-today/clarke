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
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 overflow-x-auto">
      <Link href="/library" className="flex items-center hover:text-gray-900">
        <Home size={16} />
      </Link>

      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight size={16} className="text-gray-400" />
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <Link href={item.href} className="hover:text-gray-900">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
