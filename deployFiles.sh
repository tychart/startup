#!/bin/bash

while getopts k:h:s: flag
do
    case "${flag}" in
        h) host=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$host" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployFiles.sh -h <host> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying files for $service to $hostname with $key\n"

# Step 1
printf "\n----> Clear out the previous distribution on the target.\n"
ssh $host << ENDSSH
rm -rf services/${service}/public
mkdir -p services/${service}/public
ENDSSH

# Step 2
printf "\n----> Copy the distribution package to the target.\n"
scp -r * $host:services/$service/public
