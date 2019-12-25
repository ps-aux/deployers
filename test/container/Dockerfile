FROM ubuntu:18.04
RUN apt-get update && \
    apt install docker.io  --assume-yes && \
    apt install openssh-server  --assume-yes && \
    # Won't start without
    mkdir /var/run/sshd

RUN  echo 'root:root' | chpasswd

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
