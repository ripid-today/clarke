"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { Article } from "@/types/library";

interface DownloadButtonArticleProps {
  mode: "article";
  article: Article;
}

interface DownloadButtonModuleProps {
  mode: "module";
  folderId: string;
  folderName: string;
  folderDescription?: string;
  folderSlug: string;
}

interface DownloadButtonMasterclassProps {
  mode: "masterclass";
  folderId: string;
  folderName: string;
  folderDescription?: string;
  folderSlug: string;
}

type DownloadButtonProps =
  | DownloadButtonArticleProps
  | DownloadButtonModuleProps
  | DownloadButtonMasterclassProps;

function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DownloadButton(props: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setError(null);

    if (props.mode === "article") {
      triggerDownload(props.article.content, `${props.article.slug}.md`);
      return;
    }

    setIsDownloading(true);

    try {
      if (props.mode === "module") {
        const res = await fetch(`/api/library/articles?folderId=${props.folderId}`);
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        const articles: Article[] = data.articles || [];

        const lines: string[] = [
          `# ${props.folderName}`,
          ...(props.folderDescription ? [`\n${props.folderDescription}`] : []),
        ];

        for (const article of articles) {
          lines.push("\n---\n");
          lines.push(`## ${article.title}`);
          lines.push("");
          lines.push(article.content);
        }

        triggerDownload(lines.join("\n"), `${props.folderSlug}.md`);
      }

      if (props.mode === "masterclass") {
        const foldersRes = await fetch(`/api/library/folders?parentId=${props.folderId}`);
        if (!foldersRes.ok) throw new Error("Failed to fetch modules");
        const foldersData = await foldersRes.json();
        const modules = (foldersData.folders || []).sort(
          (a: { order: number }, b: { order: number }) => a.order - b.order
        );

        const lines: string[] = [
          `# ${props.folderName}`,
          ...(props.folderDescription ? [`\n${props.folderDescription}`] : []),
        ];

        for (const mod of modules) {
          const articlesRes = await fetch(`/api/library/articles?folderId=${mod.id}`);
          if (!articlesRes.ok) continue;
          const articlesData = await articlesRes.json();
          const articles: Article[] = articlesData.articles || [];

          lines.push("\n---\n");
          lines.push(`## ${mod.name}`);
          if (mod.description) {
            lines.push("");
            lines.push(mod.description);
          }

          for (const article of articles) {
            lines.push("");
            lines.push(`### ${article.title}`);
            lines.push("");
            lines.push(article.content);
          }
        }

        triggerDownload(lines.join("\n"), `${props.folderSlug}.md`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const label =
    props.mode === "article"
      ? "Download"
      : props.mode === "module"
        ? "Download Chapter"
        : "Download All";

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="font-sans w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-cloud-dancer hover:bg-[#E5E2DC] rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        <span className="text-sm">{isDownloading ? "Downloading..." : label}</span>
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
