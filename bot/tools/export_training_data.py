"""
Export training pairs from Supabase to Vistral-7B-Chat fine-tuning format.

Usage:
  python -m bot.tools.export_training_data [options]

Options:
  --min-quality INT     Minimum quality score to include (default: 75)
  --include-negatives   Include negative examples (default: excluded)
  --output PATH         Output file path (default: training_data.jsonl)
  --format jsonl|json   Output format (default: jsonl)

Output format per record (HuggingFace chat template, Vistral-compatible):
  {
    "messages": [
      {"role": "system", "content": "..."},
      {"role": "user", "content": "..."},
      {"role": "assistant", "content": "..."}
    ],
    "metadata": {
      "quality_score": 92,
      "is_negative": false,
      "feedback_category": null,
      "session_id": "...",
      "created_at": "..."
    }
  }
"""
import argparse
import json
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from bot.tools.memory import get_training_pairs


def build_record(row: dict) -> dict:
    return {
        "messages": [
            {"role": "system", "content": row["system_prompt"]},
            {"role": "user", "content": row["user_input"]},
            {"role": "assistant", "content": row["assistant_output"]},
        ],
        "metadata": {
            "quality_score": row.get("quality_score"),
            "is_negative": row.get("is_negative", False),
            "feedback_category": row.get("feedback_category"),
            "session_id": row.get("session_id"),
            "created_at": row.get("created_at"),
        },
    }


def main():
    parser = argparse.ArgumentParser(description="Export Cơ training pairs for Vistral fine-tuning")
    parser.add_argument("--min-quality", type=int, default=75, help="Minimum quality score (default: 75)")
    parser.add_argument("--include-negatives", action="store_true", help="Include negative (failed) examples")
    parser.add_argument("--output", type=str, default="training_data.jsonl", help="Output file path")
    parser.add_argument("--format", choices=["jsonl", "json"], default="jsonl", help="Output format")
    args = parser.parse_args()

    print(f"Fetching training pairs (min_quality={args.min_quality}, include_negatives={args.include_negatives})...")

    rows = get_training_pairs(
        min_quality=args.min_quality,
        exclude_negative=not args.include_negatives,
    )

    if not rows:
        print("No training pairs found matching the criteria.")
        sys.exit(0)

    records = [build_record(r) for r in rows]
    positive = sum(1 for r in records if not r["metadata"]["is_negative"])
    negative = len(records) - positive

    output_path = Path(args.output)
    if args.format == "jsonl":
        with open(output_path, "w", encoding="utf-8") as f:
            for record in records:
                f.write(json.dumps(record, ensure_ascii=False) + "\n")
    else:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"Exported {len(records)} records ({positive} positive, {negative} negative) → {output_path}")
    print(f"Format: {args.format} | Ready for Vistral-7B-Chat fine-tuning")


if __name__ == "__main__":
    main()
