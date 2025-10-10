#!/bin/sh
sessionDir="session/"
[ ! -d "$sessionDir" ] && mkdir -p "$sessionDir"

dev_ip=my.dev
myUuid=$(uuidgen)
dev_services="$sessionDir/dev_services.session.$myUuid"

echo "$dev_ip" >> $dev_services
getent hosts $dev_ip | awk '{ print $1 ; exit }' >> $dev_services
echo "|http|6081/vnc.html|Dev" >> $dev_services

cat "$dev_services"
rm -f "$dev_services"
