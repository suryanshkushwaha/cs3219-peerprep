#!/bin/bash

AGE_SOPS_KEY_FILE=${XDG_CONFIG_HOME:-$HOME/.config}/sops/age/keys.txt

if [[ -f ${AGE_SOPS_KEY_FILE} ]]; then
    echo "Keys already exist:"
    cat ${AGE_SOPS_KEY_FILE}
    exit 1
fi

# age-keygen > ${AGE_SOPS_KEY_FILE}