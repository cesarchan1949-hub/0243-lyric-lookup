#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import zipfile
from collections import Counter, defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
VENDOR = ROOT / "vendor"
DATA_DIR = ROOT / "data"
ASSET_DIR = ROOT / "assets"

CCCANTO_ZIP = VENDOR / "cccanto-170202.zip"
CCCANTO_NAME = "cccanto-webdist.txt"
CCCEDICT_READINGS_ZIP = VENDOR / "cccedict-canto-readings-150923.zip"
CCCEDICT_READINGS_NAME = "cccedict-canto-readings-150923.txt"

LINE_RE = re.compile(r"^(\S+)\s+(\S+)\s+\[([^\]]*)]\s+\{([^}]*)}(?:\s+/(.*)/)?\s*$")
CJK_RE = re.compile(r"[\u3400-\u9fff\uf900-\ufaff]")
TONE_RE = re.compile(r"([1-6])$")

TONE_TO_0243 = {
    "1": "3",
    "2": "3",
    "3": "4",
    "4": "0",
    "5": "4",
    "6": "2",
}

INITIALS = (
    "gw",
    "kw",
    "ng",
    "b",
    "p",
    "m",
    "f",
    "d",
    "t",
    "n",
    "l",
    "g",
    "k",
    "h",
    "z",
    "c",
    "s",
    "j",
    "w",
)


def read_zip_text(zip_path: Path, member: str) -> str:
    with zipfile.ZipFile(zip_path) as archive:
        return archive.read(member).decode("utf-8")


def cjk_only(text: str) -> str:
    return "".join(CJK_RE.findall(text))


def normalize_jyutping(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def split_syllables(jyutping: str) -> list[str]:
    return [part for part in normalize_jyutping(jyutping).split(" ") if TONE_RE.search(part)]


def syllable_to_0243(syllable: str) -> str | None:
    match = TONE_RE.search(syllable)
    if not match:
        return None
    return TONE_TO_0243.get(match.group(1))


def final_for_syllable(syllable: str) -> str:
    base = TONE_RE.sub("", syllable.lower())
    if base == "ng":
        return "ng"
    for initial in INITIALS:
        if base.startswith(initial) and len(base) > len(initial):
            return base[len(initial) :]
    return base


def parse_lines(text: str, source: str) -> list[dict]:
    rows: list[dict] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        match = LINE_RE.match(line)
        if not match:
            continue
        traditional, simplified, pinyin, jyutping, definitions = match.groups()
        pure = cjk_only(traditional)
        syllables = split_syllables(jyutping)
        if not pure or not syllables or len(pure) != len(syllables):
            continue
        pattern_parts = [syllable_to_0243(item) for item in syllables]
        if any(part is None for part in pattern_parts):
            continue
        finals = [final_for_syllable(item) for item in syllables]
        rows.append(
            {
                "t": traditional,
                "s": simplified,
                "j": " ".join(syllables),
                "p": "".join(pattern_parts),
                "f": finals[-1] if finals else "",
                "d": clean_definition(definitions or ""),
                "src": source,
                "l": len(pure),
            }
        )
    return rows


def clean_definition(text: str) -> str:
    if not text:
        return ""
    parts = [part.strip() for part in text.split("/") if part.strip()]
    return "; ".join(parts[:2])[:180]


def merge_entries(*groups: list[dict]) -> list[dict]:
    merged: dict[tuple[str, str], dict] = {}
    for group in groups:
        for entry in group:
            key = (entry["t"], entry["j"])
            existing = merged.get(key)
            if existing is None:
                merged[key] = entry
                continue
            if not existing.get("d") and entry.get("d"):
                existing["d"] = entry["d"]
            if existing["src"] != entry["src"]:
                existing["src"] = "both"
    return sorted(
        merged.values(),
        key=lambda item: (item["l"], item["p"], item["f"], item["t"], item["j"]),
    )


def build_char_readings(entries: list[dict]) -> dict[str, list[dict]]:
    buckets: dict[str, Counter[tuple[str, str, str]]] = defaultdict(Counter)
    for entry in entries:
        syllables = split_syllables(entry["j"])
        for text_key in ("t", "s"):
            chars = cjk_only(entry[text_key])
            if len(chars) != len(syllables):
                continue
            for char, syllable in zip(chars, syllables):
                mapped = syllable_to_0243(syllable)
                if not mapped:
                    continue
                buckets[char][(syllable, mapped, final_for_syllable(syllable))] += 1

    char_readings: dict[str, list[dict]] = {}
    for char, counter in buckets.items():
        readings = [
            {"j": syllable, "p": pattern, "f": final, "n": count}
            for (syllable, pattern, final), count in counter.most_common(6)
        ]
        char_readings[char] = readings
    return dict(sorted(char_readings.items(), key=lambda item: item[0]))


def make_char_entries(char_readings: dict[str, list[dict]]) -> list[dict]:
    entries: list[dict] = []
    for char, readings in char_readings.items():
        for reading in readings[:3]:
            entries.append(
                {
                    "t": char,
                    "s": char,
                    "j": reading["j"],
                    "p": reading["p"],
                    "f": reading["f"],
                    "d": "单字读音",
                    "src": "derived",
                    "l": 1,
                }
            )
    return entries


def draw_tone_asset() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    width, height = 960, 540
    image = Image.new("RGB", (width, height), "#f7f4ec")
    draw = ImageDraw.Draw(image)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 54)
        label_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 34)
        small_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 24)
    except OSError:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        small_font = ImageFont.load_default()

    draw.text((64, 50), "0243 tone map", fill="#202020", font=title_font)
    draw.text((68, 120), "Cantonese lyric-writing buckets", fill="#606060", font=small_font)

    items = [
        ("0", "tone 4", "#1f6f8b"),
        ("2", "tone 6", "#4a5d23"),
        ("4", "tone 3 / 5", "#9b4f19"),
        ("3", "tone 1 / 2", "#8f2f4a"),
    ]
    base_y = 395
    max_bar = 280
    for index, (digit, tone, color) in enumerate(items):
        x = 88 + index * 220
        bar_height = 72 + index * 58
        y = base_y - bar_height
        draw.rounded_rectangle((x, y, x + 118, base_y), radius=14, fill=color)
        draw.text((x + 37, y + 18), digit, fill="white", font=title_font)
        draw.text((x - 4, base_y + 18), tone, fill="#303030", font=small_font)
        draw.line((x + 144, base_y - max_bar, x + 144, base_y), fill="#d0cbc0", width=2)

    draw.text((690, 82), "loose 0243", fill="#303030", font=label_font)
    draw.text((690, 136), "1/2 -> 3\n3/5 -> 4\n4 -> 0\n6 -> 2", fill="#4b4b4b", font=small_font, spacing=10)
    image.save(ASSET_DIR / "tone-map.png", optimize=True)


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    ASSET_DIR.mkdir(parents=True, exist_ok=True)

    cccanto = parse_lines(read_zip_text(CCCANTO_ZIP, CCCANTO_NAME), "canto")
    cccedict_readings = parse_lines(
        read_zip_text(CCCEDICT_READINGS_ZIP, CCCEDICT_READINGS_NAME),
        "readings",
    )
    entries = merge_entries(cccanto, cccedict_readings)
    char_readings = build_char_readings(entries)
    all_entries = merge_entries(entries, make_char_entries(char_readings))

    lexicon = {
        "schema": 1,
        "entries": all_entries,
        "chars": char_readings,
    }
    metadata = {
        "generated": "2026-06-02",
        "entryCount": len(all_entries),
        "wordEntryCount": len(entries),
        "charCount": len(char_readings),
        "sources": [
            {
                "name": "CC-Canto",
                "url": "https://cccanto.org/download.html",
                "license": "Creative Commons Attribution-ShareAlike 3.0",
            },
            {
                "name": "CC-CEDICT Cantonese readings",
                "url": "https://cccanto.org/download.html",
                "license": "Creative Commons Attribution-ShareAlike 3.0",
            },
        ],
        "toneMapping": TONE_TO_0243,
        "sourceLabels": {
            "canto": "CC-Canto",
            "readings": "CC-CEDICT Cantonese readings",
            "both": "CC-Canto + CC-CEDICT",
            "derived": "开放读音派生",
        },
    }

    (DATA_DIR / "lexicon.json").write_text(json.dumps(lexicon, ensure_ascii=False, separators=(",", ":")))
    (DATA_DIR / "metadata.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2))
    draw_tone_asset()

    print(json.dumps(metadata, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
