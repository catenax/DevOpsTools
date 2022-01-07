#!/bin/bash
#PG_SECRETS=('PG_HOST' 'PG_PORT' 'PG_USER' 'PG_PASS')
#for sec in "${PG_SECRETS[@]}"
#do
#  sed -i 's/$sec/\${{ secrets.$sec }}/g' backstage-values.yaml
#done
sed -i "s/PG_HOST/${{ secrets.PG_HOST }}/g" Backstage/backstage-values.yaml
sed -i "s/PG_PORT/${{ secrets.PG_PORT }}/g" Backstage/backstage-values.yaml
sed -i "s/PG_USER/${{ secrets.CATENAX_ADMIN_USER }}/g" Backstage/backstage-values.yaml
sed -i "s/PG_PASS/${{ secrets.CATENAX_ADMIN_PASSWORD }}/g" Backstage/backstage-values.yaml
