FROM mysql:latest

ENV MYSQL_HOST_IP=127.0.0.2
ENV MYSQL_ROOT_USER=root
ENV MYSQL_ROOT_PASSWORD=rootpass

RUN mkdir /opt/mysql && mkdir /opt/mysql/scripts

ADD scripts/create-tables.sh /opt/mysql/scripts/
ADD scripts/create_user_table.sql /opt/mysql/scripts/

WORKDIR /opt/mysql/scripts

EXPOSE 3306

CMD ["./create-tables.sh"]

