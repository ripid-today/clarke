import Link from "next/link";

interface CategoryTabsProps {
  activeCategory?: "vietnam" | "world";
}

const tabs = [
  { label: "All", value: undefined as undefined | "vietnam" | "world" },
  { label: "Vietnam", value: "vietnam" as const },
  { label: "World", value: "world" as const },
];

export function CategoryTabs({ activeCategory }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 mb-6 border-b border-claude-secondary/30">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.value;
        const href = tab.value
          ? `/library/daily-news?category=${tab.value}`
          : "/library/daily-news";
        return (
          <Link
            key={tab.label}
            href={href}
            className={`px-4 py-2 text-[15px] font-medium border-b-2 -mb-px transition-colors duration-150 ${
              isActive
                ? "border-claude-primary text-claude-primary"
                : "border-transparent text-claude-secondary hover:text-black hover:border-black/30"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
