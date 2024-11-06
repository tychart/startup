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

#printf "\n----> Deploying files for $service to $hostname with $key\n"

# Step 1
#printf "\n----> Clear out the previous distribution on the target.\n"
#ssh $host << ENDSSH
#rm -rf services/${service}/public
#mkdir -p services/${service}/public
#ENDSSH

# Step 2
#printf "\n----> Copy the distribution package to the target.\n"
#scp -r * $host:services/$service/public

#---------------------------------------------------------------------------------------------------------
printf "\n----> Deploying React bundle $service to $hostname with $key\n"

# Step 1
printf "\n----> Build the distribution package\n"
rm -rf build
mkdir build
npm install # make sure vite is installed so that we can bundle
npm run build # build the React front end
cp -rf dist/* build # move the React front end to the target distribution

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh $host << ENDSSH
rm -rf services/${service}/public
mkdir -p services/${service}/public
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r build/* $host:services/$service/public

# Step 5
printf "\n----> Removing local copy of the distribution package\n"
rm -rf build

