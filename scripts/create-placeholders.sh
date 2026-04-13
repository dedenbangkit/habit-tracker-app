#!/bin/bash

# Create placeholder icons using ImageMagick or a simple approach
# This creates minimal valid PNG files for development

ASSETS_DIR="assets"
mkdir -p "$ASSETS_DIR"

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to generate icons..."
    
    # Generate icons with indigo background and white checkmark-like design
    convert -size 1024x1024 xc:'#6366F1' \
        -fill white -draw "circle 512,512 512,256" \
        -fill '#6366F1' -draw "circle 512,512 512,320" \
        -fill white -font Helvetica -pointsize 400 -gravity center -annotate 0 '✓' \
        "$ASSETS_DIR/icon.png"
    
    convert -size 1024x1024 xc:'#6366F1' \
        -fill white -font Helvetica -pointsize 400 -gravity center -annotate 0 '✓' \
        "$ASSETS_DIR/adaptive-icon.png"
    
    convert -size 200x200 xc:'#6366F1' \
        -fill white -font Helvetica -pointsize 80 -gravity center -annotate 0 '✓' \
        "$ASSETS_DIR/splash-icon.png"
    
    convert -size 48x48 xc:'#6366F1' \
        -fill white -font Helvetica -pointsize 20 -gravity center -annotate 0 '✓' \
        "$ASSETS_DIR/favicon.png"
    
    echo "Icons generated successfully!"
else
    echo "ImageMagick not found. Please install it or create icons manually."
    echo ""
    echo "Required icons:"
    echo "  - assets/icon.png (1024x1024)"
    echo "  - assets/adaptive-icon.png (1024x1024)"
    echo "  - assets/splash-icon.png (200x200)"
    echo "  - assets/favicon.png (48x48)"
    echo ""
    echo "Design suggestions:"
    echo "  - Background: #6366F1 (Indigo)"
    echo "  - Icon: White checkmark symbol"
fi
