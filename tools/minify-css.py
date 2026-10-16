#!/usr/bin/env python3
"""
Writes styles.min.css (what the page loads) from styles.css (what you edit).
Run it from the project root after every change to styles.css:

    python3 tools/minify-css.py

Conservative on purpose: it only removes comments and extra whitespace,
never rewrites values, so the result always renders exactly like styles.css.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "styles.css").read_text(encoding="utf-8")

css = re.sub(r"/\*.*?\*/", "", src, flags=re.S)        # comments
css = re.sub(r"\s+", " ", css)                         # collapse whitespace
css = re.sub(r"\s*([{};,>])\s*", r"\1", css)            # around { } ; , >
css = re.sub(r":\s+", ":", css)                         # after ":" (never before: ".a :hover" differs from ".a:hover")
css = css.replace(";}", "}").strip()

out = ROOT / "styles.min.css"
out.write_text("/* Built from styles.css by tools/minify-css.py. Edit styles.css, then rerun. */\n" + css + "\n", encoding="utf-8")
print(f"styles.css {len(src.encode()) / 1024:.1f} KB  ->  styles.min.css {out.stat().st_size / 1024:.1f} KB")
