#!/usr/bin/env bash
set -e
ssh_key=${SSH_AUTHORIZED_KEY}
echo "Running test container. SSH_AUTHORIZED_KEY='${ssh_key}'"

test -z "${ssh_key}" && echo "No SSH key provided"

if [[ ! -z "${ssh_key}" ]];then
    ssh_dir="/home/ops/.ssh"
    mkdir -p ${ssh_dir}
    echo "Using provided SSH key '${ssh_key}' as authorized key"

    tmp_file=/tmp/ssh-key

    echo ${ssh_key} > ${tmp_file}

    # Check the key
    ssh-keygen -l -f ${tmp_file}

    mv ${tmp_file}  ${ssh_dir}/authorized_keys
fi

echo "Starting SSH daemon"
/usr/sbin/sshd -D
