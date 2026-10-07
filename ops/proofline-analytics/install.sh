#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "This installer must run as root." >&2
  exit 1
fi

source_dir=${1:-$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)}
app_dir=/srv/services/apps/proofline-analytics
data_dir=/srv/services/data/proofline-analytics
report_dir=${data_dir}/report
nginx_config=/etc/nginx/conf.d/proofline-analytics.conf
service_file=/etc/systemd/system/proofline-analytics.service
timer_file=/etc/systemd/system/proofline-analytics.timer
prerotate_dir=/etc/logrotate.d/httpd-prerotate
prerotate_file=${prerotate_dir}/proofline-analytics
analytics_log=/var/log/nginx/proofline-analytics.log

for target in "$app_dir" "$data_dir" "$nginx_config" "$service_file" "$timer_file" "$prerotate_file" "$analytics_log"; do
  if [[ -e "$target" ]]; then
    echo "Refusing to overwrite existing target: $target" >&2
    exit 1
  fi
done

rollback() {
  systemctl disable --now proofline-analytics.timer >/dev/null 2>&1 || true
  rm -f "$nginx_config" "$service_file" "$timer_file" "$prerotate_file"
  rm -f "$analytics_log"
  rm -f "$app_dir/aggregate.py"
  rmdir "$app_dir" >/dev/null 2>&1 || true
  systemctl daemon-reload >/dev/null 2>&1 || true
  nginx -t >/dev/null 2>&1 && systemctl reload nginx >/dev/null 2>&1 || true
}
trap rollback ERR

/usr/bin/python3 "$source_dir/aggregate.py" --self-test

install -d -m 0755 "$app_dir"
install -d -o root -g www-data -m 0710 "$data_dir"
install -d -o root -g www-data -m 0750 "$report_dir"
install -d -m 0755 "$prerotate_dir"
install -o www-data -g adm -m 0640 /dev/null "$analytics_log"
install -m 0755 "$source_dir/aggregate.py" "$app_dir/aggregate.py"
install -m 0644 "$source_dir/proofline-analytics-nginx.conf" "$nginx_config"
install -m 0644 "$source_dir/proofline-analytics.service" "$service_file"
install -m 0644 "$source_dir/proofline-analytics.timer" "$timer_file"
install -m 0755 "$source_dir/proofline-analytics-prerotate" "$prerotate_file"

nginx -t
systemctl daemon-reload
systemctl reload nginx
systemctl enable --now proofline-analytics.timer
systemctl start proofline-analytics.service

trap - ERR
echo INSTALL_OK
