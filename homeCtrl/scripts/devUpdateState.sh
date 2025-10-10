#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

export SSHPASS=$(cat "$HOME"/github/devUpdateState.pw)
dev_ip=my.dev
myUuid=$(uuidgen)
dev_state="$sessionDir/devUpdateStateResults.session.$myUuid"

rm -f "$dev_state"

# shellcheck disable=SC2016
sshpass -e ssh updatestate@$dev_ip 'echo $(cat update-in-progress.flag)' > "$dev_state" 2>&1
# shellcheck disable=SC2016
sshpass -e ssh updatestate@$dev_ip 'echo $(cat last-update.flag)' >> "$dev_state" 2>&1
# shellcheck disable=SC2016
sshpass -e ssh updatestate@$dev_ip 'echo $(cat diun-file)' >> "$dev_state" 2>&1

cat "$dev_state"
rm -f "$dev_state"