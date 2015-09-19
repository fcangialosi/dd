cd /root/dd/invoices/

cat todays_orders_header.txt recent_orders.txt > todays_orders.txt

mailx -a 'From: Order Form <orders@davidanddads.com>' -s "Today's Orders" "catering@davidanddads.com" < todays_orders.txt

cat recent_orders.txt >> recent_orders.archive
rm recent_orders.txt
