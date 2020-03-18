FROM circleci/node:13.2.0


# Base
RUN sudo apt-get update && \
    sudo apt-get install vim -y && \
    sudo apt-get install curl -y && \
    sudo apt-get install gpg -y && \
    sudo curl -L https://storage.googleapis.com/kubernetes-release/release/v1.17.0/bin/linux/amd64/kubectl -o /usr/bin/kubectl && \
        sudo chmod +x /usr/bin/kubectl && \
    sudo curl -L https://github.com/kubernetes-sigs/kind/releases/download/v0.7.0/kind-linux-amd64 -o /usr/bin/kind && \
        sudo chmod +x /usr/bin/kind && \
    curl -L https://github.com/mozilla/sops/releases/download/v3.5.0/sops_3.5.0_amd64.deb -o /tmp/sops.deb && \
    sudo dpkg -i /tmp/sops.deb





