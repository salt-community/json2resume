if __name__ == '__main__':
    from pathlib import Path

    png_path = Path("small-bird-1.png")  # adjust path if needed
    png_bytes = png_path.read_bytes()

    # Example: verify length or use the bytes
    print(png_bytes)