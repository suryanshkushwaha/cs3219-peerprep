#!/bin/bash

COMMAND=$1
shift

FILES=(
    secrets/*
    tf_backend/*.tfstate*
)

encrypt() {
    for FILE in ${FILES[@]}; do
        if [[ $FILE == *".enc" ]]; then
            continue
        fi
        echo "Encrypting $FILE to $FILE.enc"
        sops -e --input-type json --output-type json $FILE > $FILE.enc
    done
}

decrypt() {
    for FILE in ${FILES[@]}; do
        if [[ $FILE == *".enc" ]]; then
            continue
        fi
        echo "Decrypting $FILE.enc to $FILE"
        sops -d --input-type json --output-type json $FILE.enc > $FILE
    done
}

if $COMMAND == "encrypt" || $COMMAND == "decrypt"; then
    eval $COMMAND "$@"
else
  echo "Usage: secret.sh [encrypt|decrypt]"
fi