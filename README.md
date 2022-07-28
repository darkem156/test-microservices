# Hi! I am Darkem

## This is a little personal test to learn and practice the usage of microservices on NodeJS using message queues with RabbitMQ. If you want to run or modify this test, you are in total liberty to do that. This is not a great work (as I said, it is only a test) but for people who are learning to create microservices on NodeJS (like me), I think this can be helpful.

### What you need to run this code?
- Docker & Docker Compose

### How to run the code

1. Clone the repository
2. Build the images of the services with Docker Compose:
    ~~~
    $ docker-compose build
    ~~~

3. Run all the necesary containers with Docker Compose:
    ~~~
    $ docker-compose up
    ~~~
    This will create the following container:
    - user-service
    - frontend-service (On port 3002)
    - rabbit-test (On port 5672)
    - mysqldb

    All of them in the network test-microservices_default

4. Before start register users on the database, you need to create itself. For this, we will use the command "cat". If you are on Windows, you must use the PowerShell. But if you are on Linux or Mac you can use any shell. 
    1. Locate your shell into the folder "database" of the repository.
    2. Type the next command on the shell (if the command fail, maybe you just need to wait a few seconds until the mysql container is ready):
        ~~~
        $ cat db.sql | docker exec -i mysqldb /usr/bin/mysql -u root --password=password
        ~~~
And that's it. Now you can go to localhost:3002 to verify that the app is ready.

### How to use the app?

This is so simple. Just type on your browser the link **localhost:3002/user&password&email@dominio.com**. This will register on the database a user with the user "user" with password "password" and with email "email@dominio.com".

You can see the users on the database with the following steps:

1. Connect a MySQL client with the database server:
    ~~~
    $ docker run -it --network test-microservices_default --rm mysql mysql -h mysqldb -u root -p
    ~~~
2. This will display a MySQL client. Then we need to use the database "test":
    ~~~
    mysql> USE test;
    ~~~
3. And typing the following command we can see all the registered users:
    ~~~
    mysql> SELECT * FROM users;
    ~~~