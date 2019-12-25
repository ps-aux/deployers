FROM ubuntu:18.04
RUN apt-get update && \
    apt install docker.io  --assume-yes && \
    apt install openssh-server  --assume-yes && \
    # Won't start without
    mkdir /var/run/sshd

RUN useradd ops --groups docker && \
    mkdir /home/ops && \
    chown ops /home/ops && \
    echo 'ops:password' | chpasswd && \
    mkdir /home/ops/deployments

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
