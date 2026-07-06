from pathlib import Path
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "public" / "assets" / "images"

LIMITS = {
    "previewImages": 900,
    "cover": 1800,
}

DEFAULT_MAX_SIDE = 2000
MIN_SIZE_BYTES = 1_500_000
WEBP_QUALITY = 82


def max_side_for(path: Path) -> int:
    parts = set(path.parts)
    for folder, limit in LIMITS.items():
        if folder in parts:
            return limit
    return DEFAULT_MAX_SIDE


def optimize_image(path: Path) -> tuple[Path, int, int, bool]:
    before = path.stat().st_size
    suffix = path.suffix.lower()
    if before < MIN_SIZE_BYTES and suffix != ".png":
        return path, before, before, False

    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).copy()
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

        max_side = max_side_for(path)
        largest = max(image.size)
        if largest > max_side:
            scale = max_side / largest
            next_size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
            image = image.resize(next_size, Image.Resampling.LANCZOS)

        save_kwargs = {"optimize": True}
        if suffix in {".jpg", ".jpeg"}:
            image_format = "JPEG"
            if image.mode != "RGB":
                image = image.convert("RGB")
            save_kwargs.update({"quality": 84, "progressive": True})
        elif suffix == ".png":
            image_format = "WEBP"
            save_kwargs.update({"quality": WEBP_QUALITY, "method": 6})
        elif suffix == ".webp":
            image_format = "WEBP"
            save_kwargs.update({"quality": WEBP_QUALITY, "method": 6})
        else:
            image_format = None

        target_path = path.with_suffix(".webp") if suffix == ".png" else path
        temp_path = target_path.with_name(target_path.name + ".tmp")
        image.save(temp_path, format=image_format, **save_kwargs)

    after = temp_path.stat().st_size
    if suffix == ".png" or after < before:
        path.unlink()
        if target_path.exists():
            target_path.unlink()
        temp_path.rename(target_path)
        return target_path, before, after, True

    temp_path.unlink(missing_ok=True)
    return path, before, before, False


def main() -> None:
    changed = []
    for path in IMAGE_ROOT.rglob("*"):
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        output_path, before, after, did_change = optimize_image(path)
        if did_change:
            changed.append((output_path.relative_to(ROOT).as_posix(), before, after))

    before_total = sum(item[1] for item in changed)
    after_total = sum(item[2] for item in changed)
    print(f"optimized {len(changed)} images")
    print(f"changed bytes: {before_total} -> {after_total}")
    for rel, before, after in sorted(changed, key=lambda item: item[1] - item[2], reverse=True)[:30]:
        print(f"{rel}: {before} -> {after}")


if __name__ == "__main__":
    main()
