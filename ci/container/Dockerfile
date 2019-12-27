FROM circleci/node:13.2.0


# Base
RUN sudo apt-get update && \
    sudo apt-get install vim -y && \
    sudo apt-get install curl -y && \
    sudo apt-get install gpg -y && \
    curl -L https://github.com/mozilla/sops/releases/download/v3.5.0/sops_3.5.0_amd64.deb -o /tmp/sops.deb && \
    sudo dpkg -i /tmp/sops.deb





