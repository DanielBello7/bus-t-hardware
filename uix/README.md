# bus-t bus unit desktop application

to build for linux which is the intended target of the application
run:

- docker-compose up --build

** NOTE **
we skipped `deb` and `snap` for build incompetences, and only built for AppImage.

whenever trying to copy into the desktop unit
run:

- scp -r ./linux-v3 daniel@10.0.0.188:~/Apps/bust/app/
  replace parts as needed in command
