#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

export SSHPASS=$(cat "$HOME"/github/nasUpdateState.pw)
nas_ip=my.nas
myUuid=$(uuidgen)
nas_state="$sessionDir/nasShutdownCancel.session.$myUuid"

rm -f "$nas_state"

# shellcheck disable=SC2016
sshpass -e ssh updatestate@$nas_ip 'echo $(sudo shutdown -c)' > "$nas_state" 2>&1
# shellcheck disable=SC2016
sshpass -e ssh updatestate@$nas_ip 'echo $(rm -f nasShutdown.info)'

cat "$nas_state"
rm -f "$nas_state"