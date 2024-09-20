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
        sops -e --input-type json --output-type json $FILE > $FILE.enc
    done
}

decrypt() {
    for FILE in ${FILES[@]}; do
        echo "Decrypting $FILE.enc to $FILE"
        sops -d --input-type json --output-type json $FILE.enc > $FILE
    done
}

if $COMMAND == "encrypt" || $COMMAND == "decrypt"; then
    eval $COMMAND "$@"
else
  echo "Usage: secret.sh [encrypt|decrypt]"
fi