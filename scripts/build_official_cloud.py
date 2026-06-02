#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
LOCAL_LEXICON = DATA_DIR / "lexicon.json"
OUTPUT = DATA_DIR / "official-cloud.json"
CACHE_DIR = ROOT / ".cache" / "official-cloud"
PUBLIC_API = "https://www.0243.hk/api/cls/"


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
    if text in phrase_map:
        return phrase_map[text]
    return "".join(char_map.get(char, char) for char in text)


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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("patterns", nargs="*", default=["43"])
    parser.add_argument("--mode", default="m1")
    args = parser.parse_args()

    phrase_map, char_map = load_simplifier()
    patterns: dict[str, list[dict]] = {}
    for pattern in args.patterns:
        words = load_or_fetch(pattern, args.mode)
        patterns[pattern] = [
            {
                "t": word,
                "s": simplify(word, phrase_map, char_map),
                "rank": rank + 1,
            }
            for rank, word in enumerate(words)
        ]

    payload = {
        "schema": 1,
        "source": "0243.hk public /api/cls/",
        "mode": args.mode,
        "patterns": patterns,
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
    print(json.dumps({key: len(value) for key, value in patterns.items()}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
