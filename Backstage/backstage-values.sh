#!/bin/bash
PG_SECRETS=('PG_HOST' 'PG_PORT' 'PG_USER' 'PG_PASS')
for sec in "${PG_SECRETS[@]}"
do
  echo sed -i \'s/$sec/\${{ secrets.$sec }}/g\' backstage-values.yaml
done
#sed -i 's/PG_HOST/${{ secrets.PG_HOST }}/g' backstage-values.yaml
#sed -i 's/PG_PORT/${{ secrets.PG_PORT }}/g' backstage-values.yaml
#sed -i 's/PG_USER/${{ secrets.PG_USER }}/g' backstage-values.yaml
#sed -i 's/PG_PASS/${{ secrets.PG_PASS }}/g' backstage-values.yaml
