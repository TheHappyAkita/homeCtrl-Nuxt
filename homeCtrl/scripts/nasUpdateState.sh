#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

export SSHPASS=$(cat "$HOME"/github/nasUpdateState.pw)
nas_ip=my.nas
myUuid=$(uuidgen)
nas_state="$sessionDir/nasUpdateStateResults.session.$myUuid"

rm -f "$nas_state"

# shellcheck disable=SC2016
sshpass -e ssh updatestate@$nas_ip 'echo $(cat update-in-progress.flag)' > "$nas_state" 2>&1
# shellcheck disable=SC2016
sshpass -e ssh updatestate@$nas_ip 'echo $(cat last-update.flag)' >> "$nas_state" 2>&1
# shellcheck disable=SC2016
sshpass -e ssh updatestate@$nas_ip 'echo $(cat diun-file)' >> "$nas_state" 2>&1

cat "$nas_state"
rm -f "$nas_state"