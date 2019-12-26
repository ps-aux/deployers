#!/usr/bin/env bash

set -e

name="eu.gcr.io/devops-247114/deployers-test-container"
tag=$1

if [[ -z ${tag} ]];then
    echo "Tag not provided"
    exit 1
fi

image_name=${name}:${tag}
docker build . -t  ${image_name}

docker push ${image_name}
