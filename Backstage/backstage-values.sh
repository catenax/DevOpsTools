#!/bin/bash
PG_SECRETS=('PG_HOST' 'PG_PORT' 'PG_USER' 'PG_PASS')
for sec in "${PG_SECRETS[@]}"
do
  sed -i 's/$sec/\${{ secrets.$sec }}/g' backstage-values.yaml
done
