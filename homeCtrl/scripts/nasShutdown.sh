#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

export SSHPASS=$(cat "$HOME"/github/nasUpdateState.pw)
nas_ip=my.nas
myUuid=$(uuidgen)
nas_state="$sessionDir/nasShutdown.session.$myUuid"

rm -f "$nas_state"

# shellcheck disable=SC2016
sshpass -e ssh updatestate@$nas_ip 'echo $(sudo shutdown +5 &> nasShutdown.info && cat nasShutdown.info)' > "$nas_state" 2>&1

cat "$nas_state"
rm -f "$nas_state"