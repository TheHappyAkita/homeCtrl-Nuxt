r#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

export SSHPASS=$(cat "$HOME"/github/devUpdateState.pw)
dev_ip=my.dev
myUuid=$(uuidgen)
dev_state="$sessionDir/devShutdownInfo.session.$myUuid"
dev_time="$sessionDir/dev.time.$myUuid"

rm -f "$dev_state"

# shellcheck disable=SC2016
sshpass -e ssh updatestate@$dev_ip 'echo $(cat devShutdown.info)' > "$dev_state" 2>&1
# shellcheck disable=SC2016
sshpass -e ssh updatestate@$dev_ip 'echo $(date)' > "$dev_time_file" 2>&1

shutdownInfo=$(cat "$dev_state")
devTime=$(cat "$dev_time_file")

if [[ $devTime < $shutdownInfo ]]
then
  echo "$shutdownInfo"
else
  echo ""
fi

rm -f "$dev_state"
rm -f "$dev_time_file"