#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

export SSHPASS=$(cat "$HOME"/github/devUpdateState.pw)
dev_ip=my.dev
myUuid=$(uuidgen)
dev_state="$sessionDir/devShutdownCancel.session.$myUuid"

rm -f "$dev_state"

# shellcheck disable=SC2016
sshpass -e ssh updatestate@$dev_ip 'echo $(sudo shutdown -c)' > "$dev_state" 2>&1
# shellcheck disable=SC2016
sshpass -e ssh updatestate@$dev_ip 'echo $(rm -f devShutdown.info)'

cat "$dev_state"
rm -f "$dev_state"