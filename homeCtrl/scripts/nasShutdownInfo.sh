#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

export SSHPASS=$(cat "$HOME"/github/nasUpdateState.pw)
nas_ip=my.nas
myUuid=$(uuidgen)
nas_state="$sessionDir/nasShutdownInfo.session.$myUuid"
nas_time="$sessionDir/nas.time.$myUuid"

rm -f "$nas_state"

# shellcheck disable=SC2016
sshpass -e ssh updatestate@$nas_ip 'echo $(cat nasShutdown.info)' > "$nas_state" 2>&1
# shellcheck disable=SC2016
sshpass -e ssh updatestate@$nas_ip 'echo $(date)' > "$nas_time_file" 2>&1

shutdownInfo=$(cat "$nas_state")
nasTime=$(cat "$nas_time_file")

if [[ $nasTime < $shutdownInfo ]]
then
  echo "$shutdownInfo"
else
  echo ""
fi

rm -f "$nas_state"
rm -f "$nas_time_file"