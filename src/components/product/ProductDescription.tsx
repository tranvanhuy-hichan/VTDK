import React from "react";
import { CheckCircle2 } from "lucide-react";

type DescriptionBlock =
  | { type: "heading"; text: string; key: string }
  | { type: "list"; items: string[]; key: string }
  | { type: "spec"; label: string; value: string; key: string }
  | { type: "paragraph"; text: string; key: string };

function parseDescription(shortDesc: string): DescriptionBlock[] {
  const lines = shortDesc.split("\n");
  const blocks: DescriptionBlock[] = [];
  let currentList: string[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", items: currentList, key });
      currentList = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(`list-${i}`);
      return;
    }

    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      flushList(`list-${i}`);
      blocks.push({ type: "heading", text: trimmed.replace(/^#+\s*/, ""), key: `h-${i}` });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(trimmed.replace(/^[-*]\s*/, ""));
    } else if (trimmed.includes(":") && !trimmed.startsWith("http") && !trimmed.startsWith("Note")) {
      flushList(`list-${i}`);
      const [label, ...valParts] = trimmed.split(":");
      blocks.push({
        type: "spec",
        label: label.replace(/^[#-]\s*/, "").trim(),
        value: valParts.join(":").trim(),
        key: `s-${i}`,
      });
    } else {
      flushList(`list-${i}`);
      blocks.push({ type: "paragraph", text: trimmed, key: `p-${i}` });
    }
  });

  flushList("list-end");
  return blocks;
}

/** Groups consecutive "spec" blocks together so they render as one table instead of separate rows. */
function groupConsecutiveSpecs(blocks: DescriptionBlock[]): (DescriptionBlock | { type: "spec-group"; specs: Extract<DescriptionBlock, { type: "spec" }>[]; key: string })[] {
  const grouped: (DescriptionBlock | { type: "spec-group"; specs: Extract<DescriptionBlock, { type: "spec" }>[]; key: string })[] = [];

  for (const block of blocks) {
    if (block.type === "spec") {
      const last = grouped[grouped.length - 1];
      if (last && last.type === "spec-group") {
        last.specs.push(block);
      } else {
        grouped.push({ type: "spec-group", specs: [block], key: `group-${block.key}` });
      }
    } else {
      grouped.push(block);
    }
  }

  return grouped;
}

interface ProductDescriptionProps {
  shortDesc: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ shortDesc }) => {
  const blocks = groupConsecutiveSpecs(parseDescription(shortDesc));

  return (
    <div className="space-y-2">
      {blocks.map((block) => {
        if (block.type === "spec-group") {
          return (
            <div key={block.key} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden my-3">
              {block.specs.map((spec, idx) => (
                <div
                  key={spec.key}
                  className={`grid grid-cols-1 sm:grid-cols-3 gap-1 px-3 py-2.5 text-xs sm:text-sm ${
                    idx % 2 === 1 ? "bg-slate-50 dark:bg-slate-800/40" : "bg-white dark:bg-transparent"
                  }`}
                >
                  <span className="font-bold text-slate-900 dark:text-slate-200">{spec.label}</span>
                  <span className="sm:col-span-2 text-slate-700 dark:text-slate-300">{spec.value}</span>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "heading") {
          return (
            <h3
              key={block.key}
              className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-2 border-l-4 border-[#075FA8] pl-2.5"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={block.key} className="space-y-2 my-3 pl-2 list-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              {block.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={block.key} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-2">
              {block.text}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
};
