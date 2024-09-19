#!/bin/bash

COMMAND=$1
shift

FILES=(
    secrets/*
    tf_backend/*.tfstate*
)

encrypt() {
    for FILE in ${FILES[@]}; do
        if [[ $FILE == *.enc ]]; then
            continue
        fi
        sops -e $FILE > $FILE.enc
    done
}

decrypt() {
    for FILE in ${FILES[@]}; do
        if [[ $FILE != *.enc ]]; then
            continue
        fi
        sops -d $FILE.enc > $FILE
    done
}

if $COMMAND == "encrypt" || $COMMAND == "decrypt"; then
    eval $COMMAND "$@"
else
  echo "Usage: secret.sh [encrypt|decrypt]"
fi