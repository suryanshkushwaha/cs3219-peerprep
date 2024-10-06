#!/bin/bash

COMMAND=$1
shift

FILES=(
    secrets/gcp_credentials.json
    tf_backend/terraform.tfstate
    tf_backend/terraform.tfstate.backup
)

encrypt() {
    for FILE in ${FILES[@]}; do
        echo "Encrypting $FILE to $FILE.enc"
        if [ ! -f $FILE ]; then
            echo "File $FILE does not exist"
            exit 1
        fi
        sops -e --input-type json --output-type json $FILE > $FILE.enc
    done
}

decrypt() {
    for FILE in ${FILES[@]}; do
        echo "Decrypting $FILE.enc to $FILE"
        if [ ! -f $FILE.enc ]; then
            echo "File $FILE.enc does not exist"
            exit 1
        fi
        sops -d --input-type json --output-type json $FILE.enc > $FILE
    done
}

if $COMMAND == "encrypt" || $COMMAND == "decrypt"; then
    eval $COMMAND "$@"
else
  echo "Usage: secret.sh [encrypt|decrypt]"
fi