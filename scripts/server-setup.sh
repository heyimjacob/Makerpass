#!/bin/bash

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    ufw

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add current user to docker group
usermod -aG docker $SUDO_USER

# Set up firewall
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Create directory structure
mkdir -p /opt/itwasjacob/{docker,config,scripts}

echo "Setup complete! Please log out and back in for Docker group changes to take effect." 