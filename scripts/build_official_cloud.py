#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

import requests
try:
    from opencc import OpenCC
except ImportError:  # pragma: no cover - local fallback for machines without OpenCC
    OpenCC = None

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
LOCAL_LEXICON = DATA_DIR / "lexicon.json"
OUTPUT = DATA_DIR / "official-cloud.json"
CACHE_DIR = ROOT / ".cache" / "official-cloud"
PUBLIC_API = "https://www.0243.hk/api/cls/"
DIGITS = "0234"
OPENCC_CONVERTER = OpenCC("t2s") if OpenCC else None
SIMPLIFIED_IDENTITY_OVERRIDES = {
    "座": "座",
}


def load_simplifier() -> tuple[dict[str, str], dict[str, str]]:
    lexicon = json.loads(LOCAL_LEXICON.read_text())
    phrase_map: dict[str, str] = {}
    char_map: dict[str, str] = {}
    for entry in lexicon["entries"]:
        traditional = entry.get("t") or ""
        simplified = entry.get("s") or traditional
        if traditional and simplified and traditional != simplified:
            phrase_map.setdefault(traditional, simplified)
        if len(traditional) == len(simplified):
            for left, right in zip(traditional, simplified):
                if left != right:
                    char_map.setdefault(left, right)
    return phrase_map, char_map


def simplify(text: str, phrase_map: dict[str, str], char_map: dict[str, str]) -> str:
    if OPENCC_CONVERTER:
        return OPENCC_CONVERTER.convert(text)
    return "".join(SIMPLIFIED_IDENTITY_OVERRIDES.get(char, char_map.get(char, char)) for char in text)


def load_or_fetch(pattern: str, mode: str) -> list[str]:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = CACHE_DIR / f"{mode}-{pattern}.json"
    tmp_path = Path(f"/private/tmp/0243-api-cls-{pattern}.json")
    if cache_path.exists():
        return json.loads(cache_path.read_text())
    if tmp_path.exists():
        words = json.loads(tmp_path.read_text())
        cache_path.write_text(json.dumps(words, ensure_ascii=False, indent=2))
        return words

    body = {
        "nums": pattern,
        "sess": None,
        "mode": mode,
        "category": None,
        "topic": None,
        "dicts": [],
    }
    response = requests.post(PUBLIC_API, json=body, timeout=90)
    response.raise_for_status()
    words = response.json()
    cache_path.write_text(json.dumps(words, ensure_ascii=False, indent=2))
    return words


def generated_patterns(min_length: int, max_length: int) -> list[str]:
    patterns: list[str] = []
    current = [""]
    for length in range(1, max_length + 1):
        current = [prefix + digit for prefix in current for digit in DIGITS]
        if length >= min_length:
            patterns.extend(current)
    return patterns


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("patterns", nargs="*")
    parser.add_argument("--mode", default="m1")
    parser.add_argument("--min-length", type=int, default=1)
    parser.add_argument("--max-length", type=int, default=4)
    parser.add_argument("--delay", type=float, default=0.02)
    args = parser.parse_args()

    requested_patterns = args.patterns or generated_patterns(args.min_length, args.max_length)
    phrase_map, char_map = load_simplifier()
    patterns: dict[str, list[dict]] = {}
    for index, pattern in enumerate(requested_patterns, start=1):
        words = load_or_fetch(pattern, args.mode)
        patterns[pattern] = [
            {
                "t": word,
                "s": simplify(word, phrase_map, char_map),
                "rank": rank + 1,
            }
            for rank, word in enumerate(words)
        ]
        print(f"{index}/{len(requested_patterns)} {pattern}: {len(words)}")
        if args.delay and index < len(requested_patterns):
            time.sleep(args.delay)

    total_entries = sum(len(words) for words in patterns.values())
    payload = {
        "schema": 1,
        "source": "0243.hk public /api/cls/",
        "mode": args.mode,
        "minLength": min(len(pattern) for pattern in patterns) if patterns else 0,
        "maxLength": max(len(pattern) for pattern in patterns) if patterns else 0,
        "totalEntries": total_entries,
        "patterns": patterns,
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
    print(json.dumps({key: len(value) for key, value in patterns.items()}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
