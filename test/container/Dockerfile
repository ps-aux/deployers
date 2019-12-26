FROM ubuntu:18.04
RUN  apt-get update && \
    apt install vim --assume-yes && \
    apt install docker.io  --assume-yes && \
    apt install openssh-server  --assume-yes && \
    # Won't start without
    mkdir /var/run/sshd

RUN useradd ops --groups docker && \
    mkdir /home/ops && \
    chown ops /home/ops && \
    chsh --shel /bin/bash ops && \
    echo 'ops:password' | chpasswd && \
    mkdir /home/ops/deployments

EXPOSE 22

COPY ./entrypoint.sh /

CMD ["/entrypoint.sh"]
