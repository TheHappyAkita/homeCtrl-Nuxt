#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

export SSHPASS=$(cat "$HOME"/github/devUpdateState.pw)
dev_ip=my.dev
myUuid=$(uuidgen)
dev_state="$sessionDir/devShutdown.session.$myUuid"

rm -f "$dev_state"

# shellcheck disable=SC2016
sshpass -e ssh updatestate@$dev_ip 'echo $(touch /media/suspender/flags/suspend.fl)' > "$dev_state" 2>&1

cat "$dev_state"
rm -f "$dev_state"