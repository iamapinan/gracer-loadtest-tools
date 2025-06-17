#!/bin/bash

# Install k6 load testing tool
# This script will install k6 on different operating systems

echo "🚀 Installing k6 load testing tool..."

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "📱 Detected macOS"
    if command -v brew &> /dev/null; then
        echo "🍺 Installing k6 via Homebrew..."
        brew install k6
    else
        echo "❌ Homebrew not found. Please install Homebrew first: https://brew.sh"
        exit 1
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🐧 Detected Linux"
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        echo "📦 Installing k6 via APT..."
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6
    elif command -v yum &> /dev/null; then
        # RHEL/CentOS
        echo "📦 Installing k6 via YUM..."
        sudo yum install -y gpg
        sudo rpm --import https://dl.k6.io/key.gpg
        sudo yum-config-manager --add-repo https://dl.k6.io/rpm/stable/k6.repo
        sudo yum install k6
    else
        echo "❌ Package manager not supported. Please install k6 manually: https://k6.io/docs/getting-started/installation/"
        exit 1
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    echo "🪟 Detected Windows"
    if command -v winget &> /dev/null; then
        echo "📦 Installing k6 via winget..."
        winget install k6
    elif command -v choco &> /dev/null; then
        echo "🍫 Installing k6 via Chocolatey..."
        choco install k6
    else
        echo "❌ Please install k6 manually from: https://github.com/grafana/k6/releases"
        echo "Or install via Chocolatey: choco install k6"
        exit 1
    fi
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

# Verify installation
if command -v k6 &> /dev/null; then
    echo "✅ k6 installed successfully!"
    echo "📊 k6 version: $(k6 version)"
    echo ""
    echo "🎉 You can now run the load testing tool!"
    echo "💡 Start the development server with: npm run dev"
else
    echo "❌ k6 installation failed. Please install manually: https://k6.io/docs/getting-started/installation/"
    exit 1
fi 