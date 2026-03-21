#!/bin/bash

# core.sbs CLI Tools Uninstaller
# Removes all CLI tools and configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="$HOME/.core-sbs"
BIN_DIR="$HOME/.local/bin"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🗑️  Uninstalling core.sbs CLI tools..."

# Remove installation directory
if [ -d "$INSTALL_DIR" ]; then
    print_status "Removing installation directory: $INSTALL_DIR"
    rm -rf "$INSTALL_DIR"
    print_success "Installation directory removed"
else
    print_warning "Installation directory not found: $INSTALL_DIR"
fi

# Remove CLI tools from bin directory
tools=("create-core-app" "core-gen" "core-dev")
for tool in "${tools[@]}"; do
    if [ -f "$BIN_DIR/$tool" ]; then
        print_status "Removing $tool from $BIN_DIR"
        rm -f "$BIN_DIR/$tool"
        print_success "$tool removed"
    fi
    
    if [ -L "$BIN_DIR/$tool" ]; then
        print_status "Removing symlink for $tool"
        rm -f "$BIN_DIR/$tool"
        print_success "Symlink for $tool removed"
    fi
done

# Remove from PATH (from shell configs)
print_status "Removing from PATH configuration..."

shell_configs=("$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile" "$HOME/.bash_profile")

for config in "${shell_configs[@]}"; do
    if [ -f "$config" ]; then
        # Remove core.sbs PATH entries
        if grep -q "core-sbs" "$config" 2>/dev/null; then
            print_status "Removing core.sbs entries from $config"
            # Create backup
            cp "$config" "$config.backup.$(date +%Y%m%d_%H%M%S)"
            # Remove lines containing core-sbs
            sed -i '/core-sbs/d' "$config"
            print_success "Updated $config (backup created)"
        fi
    fi
done

print_success "Uninstallation completed successfully!"
echo
print_status "Note: You may need to restart your terminal or run:"
echo "  source ~/.bashrc"
echo
print_status "To verify removal, try:"
echo "  which create-core-app"
echo "  which core-gen" 
echo "  which core-dev"
echo
echo "✅ All core.sbs CLI tools have been removed"
