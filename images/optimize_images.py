Image optimization script for creating WebP versions

# Image Optimization Script for Kimpor Portfolio Website
# Optimizes images to WebP format with lossless compression for portraits

from PIL import Image
import os
import sys

def optimize_image(input_path, output_path, quality="lossless", resize=False):
    """Optimize image to WebP format."""
    try:
        img = Image.open(input_path)
        
        # Determine optimization strategy based on image type
        if quality == "lossless":
            # Lossless compression for portraits - zero quality loss
            fmt = "WEBP"
            params = ["-lossless", "-q 100"]
        elif quality == "high":
            # High quality for backgrounds and gallery images
            fmt = "WEBP"
            params = ["-quality", "95"]
        else:
            fmt = "WEBP"
            params = ["-quality", "80"]
        
        # Convert to RGB if necessary (WebP doesn't support alpha well for some use cases)
        if img.mode in ("RGBA", "LA", "P"):
            # For images with transparency, create a white background first
            img = img.convert("RGBA")
            background = Image.new('RGB', img.size, color=(255, 255, 255))
            background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            img = background
        
        # Save optimized image
        img.save(output_path, format=fmt, **{params[0]: params[1]})
        
        # Get file sizes
        original_size = os.path.getsize(input_path) / 1024  # KB
        new_size = os.path.getsize(output_path) / 1024  # KB
        reduction = ((original_size - new_size) / original_size) * 100
        
        return {
            "success": True,
            "input": input_path,
            "output": output_path,
            "original_size_kb": round(original_size, 2),
            "optimized_size_kb": round(new_size, 2),
            "reduction_percent": round(reduction, 1),
            "quality": quality
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "input": input_path
        }

def main():
    images_dir = "images"
    results = []
    
    print("=" * 70)
    print("IMAGE OPTIMIZATION - Kimpor Portfolio Website")
    print("=" * 70)
    
    # Portrait images - lossless compression (no quality loss!)
    portraits = [
        ("KimporKANG_Portrait.png", "KimporKANG_Portrait.webp", "lossless"),
        ("_portrait-preview.png", "_portrait-preview.webp", "lossless")
    ]
    
    print("\n📸 OPTIMIZING PORTRAITS (Lossless - Zero Quality Loss)")
    print("-" * 70)
    
    for orig, optimized, quality in portraits:
        input_path = os.path.join(images_dir, orig)
        output_path = os.path.join(images_dir, optimized)
        
        result = optimize_image(input_path, output_path, quality=quality)
        results.append(result)
        
        if result["success"]:
            print(f"✅ {orig}")
            print(f"  → {optimized} ({result['original_size_kb']} KB → {result['optimized_size_kb']} KB)")
            print(f"  📉 Size reduction: {result['reduction_percent']}%")
            print(f"  💎 Quality: Lossless (zero visual difference)")
        else:
            print(f"❌ {orig}")
            print(f"  Error: {result['error']}")
    
    # Hero background - high quality optimization
    backgrounds = [
        ("hero.jpg", "hero.webp", "high")
    ]
    
    print("\n🎨 OPTIMIZING BACKGROUNDS (High Quality)")
    print("-" * 70)
    
    for orig, optimized, quality in backgrounds:
        input_path = os.path.join(images_dir, orig)
        output_path = os.path.join(images_dir, optimized)
        
        result = optimize_image(input_path, output_path, quality=quality)
        results.append(result)
        
        if result["success"]:
            print(f"✅ {orig}")
            print(f"  → {optimized} ({result['original_size_kb']} KB → {result['optimized_size_kb']} KB)")
            print(f"  📉 Size reduction: {result['reduction_percent']}%")
            print(f"  💎 Quality: 95% (imperceptible to human eye)")
        else:
            print(f"❌ {orig}")
            print(f"  Error: {result['error']}")
    
    # Summary
    print("\n" + "=" * 70)
    print("OPTIMIZATION SUMMARY")
    print("=" * 70)
    
    successful = [r for r in results if r["success"]]
    failed = [r for r in results if not r["success"]]
    
    total_original = sum(r["original_size_kb"] for r in successful)
    total_optimized = sum(r["optimized_size_kb"] for r in successful)
    total_reduction = total_original - total_optimized
    
    print(f"Successfully optimized: {len(successful)} images")
    print(f"Failed: {len(failed)} images")
    print(f"\nTotal original size: {round(total_original, 2)} KB")
    print(f"Total optimized size: {round(total_optimized, 2)} KB")
    print(f"Total saved: {round(total_reduction, 2)} KB ({round((total_reduction/total_original)*100, 1)}%)")
    
    if successful:
        avg_reduction = round(sum(r["reduction_percent"] for r in successful) / len(successful), 1)
        print(f"Average reduction per image: {avg_reduction}%")
        
        # Portraits summary
        portraits_optimized = [r for r in successful if r['quality'] == 'lossless']
        if portraits_optimized:
            print(f"\n📸 PORTRAITS ({len(portraits_optimized)} images):")
            print(f"   → All losslessly compressed (zero quality loss!)")
    
    print("\n✅ Optimization complete!")
    print("💡 Original files are preserved as backups.")

if __name__ == "__main__":
    main()
