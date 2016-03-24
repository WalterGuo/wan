
bad:
	gulp build && rm -rf dist_online && pm2 startOrRestart ecosystem.json
build:
	gulp build 
revert:
	mv dist_online dist; mv dist_backup dist_online
80:
	sudo PORT=80 gulp
18080:
	PORT=18080 gulp
.PHONY: onlinetest
