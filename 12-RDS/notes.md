## RDS

### Database Refresher

Systems to store and manage data.

#### Relational (SQL)

Structured Query Language (SQL) is a feature of most relational database servers
Structure in and between tables of data. There is a rigid **schema**. This is
defined in advance.

There is a fixed relationship between tables. This is defined before data
is entered into the database.

Every row in a table must have a value for the **primary key**

There will be multiple tables, but each one needs a primary key. For every
table, there must be a value stored for every attribute in the table.

There is a join table with a **composite key**. The key must be unique in its
entirety.

Table relationships use keys

The Table Scehmas and relationships must be defined in advance.

#### Non-Relational (NoSQL)

Not a single thing, and is a catch all for everything else. There is generally
a week or no schema.

##### Key-Value databases

The key stores the time and the Value shows the data that wants to be recorded.
So long as every key is unique, there is no real schema or structure.

These are really fast and highly scalable.

This is also used for **in memory caching**

##### Wide Column Store

DynamoDB is one type of database.

Parition key - The search key
Other Key - sort or range key

Each needs to have one key or more keys.

Every item in a table can also have attributes, but they don't have to be
the same between values. The only requirements is the key needs to be unique.

It can be **single key** or **composite key**. Either case, it must be unique.

##### Document

Documents are generally formated using JSON or XML.

This is an extension of a key-value store.

Good for orders or contacts. This is good for whole documents or deep attribute
interations.

##### Column

Row Store (MySQL) - If you needed to read the price of one item you need that
row first. If you wanted to query all of the sizes of every order, you will
need to check for each row. Often called OLTP.

Column Store (Redshift) - Columns are stored together. Bad for sales style
but good for reporting or when all values for a specific size are required.

##### Graph

Relationships between things are formally defined and stored along in the
database itself with the data. These are great for relationship driven data.

Nodes are objects inside a graph database. They can have properties.

Edges are relationships between the nodes. They have a direction.

Relationships can also have values associated with them and they are also
stored inside the database.

Relationships are fast because interactions can be queried.

### Databases on EC2

It is always a bad idea to do this. Splitting an instance over different
AZs adds a small cost to moving the data between AZs if it happens.

#### Reasons EC2 Database might make sense

You might need access to the OS of the Database. You should question
if a client requests this, it rarely is needed.

Advanced DB Option tuning (DBROOT) AWS provides options against this.

This is typically a vendor that demands this.

DB or DB version that AWS doesn't provide.

You might need a specific version of an OS and DB that AWS doesn't provide.

#### Reasons why you really shouldn't run a database on EC2

**Admin overhead** is intense to manage EC2 and DBHost compatable

Backup and Disaster Management adds complexity.

EC2 is running in a single AZ. If the zone fails, access to the database fails.

Will miss out on features from AWS DB products.

EC2 is ON or OFF, there is no way to scale easily.

**Replication** the skills and setup time to monitor this

Performance will be slower than AWS options.

### Relational Database Service (RDS)

Database-as-a-service (DBaaS) - not entirely true more of
DatabaseServer-as-a-service. Managed Database Instance for one or more databases

Multiple engines are MySQL, MariaDB, PostgreSQL, Oracle, Microsoft SQL

Amazon Aurora. This is so different from normal RDS, it is a seperate product.

#### RDS Database Instance

Runs one of a few types of database engines and can contain multiple
user created databases. Create one when you provision the instance, but
multiple can be created after.

Database connects with a CNAME. RDS uses standard database engines.

The database can be optimized for:

db.m5 general
db.r5 memory
db.t3 burst

There is an associated size and AZ selected.

When you provision an instance, you provision storage taht is dedicated
to that instance. This is EBS storage located in the same AZ. RDS is vulnerable
to failures in that AZ.

The storage can be allocated with SSD or magnetic.

io1 - high IO
gp2 - same burst pool
magnetic - campatability

Billing is per instance and hourly rate for that compute. You are billed
for storage allocated.

### RDS Multi AZ (High-Availability)

RDS Access ONLY via database CNAME. The CNAME will point at the primary
instance. You cannot access the standby replica for any reason via RDS.

The standby replica cannot be used for extra capacity.

**Syncronous Replication** is a keyword:

1. Database writes happen
2. Primary database instance commits changes
3. Same time as the write is happening, standby replication is happening
4. Standby replica commits writes.

If any error occurs with the primary database, AWS detects this and will
failover within 60 to 120 seconds to change to the new database.

This does not provide fault tolerance - there will be some impact during change

Exam Powerups

- Multi-AZ feature is not free tier, extra infrastructure for standby. Generally
two times the price.
- The standby replica cannot be accesed directly unless a fail occurs.
- Faillover is highly available, not fault tolerant.
- Same region only (others AZ in the VPC).
- Backups taken from standby (removes performance impacts).
- AZ outage, primary failure, manual failover, instance type change, and
software patching

### RDS Backup and Restores

RPO - Recovery Point Objective

- Time between the last backup and when the failure occured
- Amount of maximum data loss
- Influences technical solution and cost
- Buisness usually provides an RPO value

RTO - Recovery Time Objective

- Time between the DR event and full recovery
- Influenced by process, staff, tech and documentation

RDS Backups

First snap is FULL size of consumed data. If you are you using single AZ

Manual snapshots will remain in your AWS account even after the life of
the snapshot. These need to be deleted manually.

Automatic Snapshots

Every 5 minutes translation logs are saved to S3. A database can then be
restored to a 5 min snapshot in time.

Automatic cleanups can be anywhere from 0 to 35 days. This will use
both the snapshots and the translation logs.

When you delete the database, they can be retained but they will expire
based on their retention period.

#### RDS Exam Powerups

When performing a restore RDS creates a new RDS with a new endpoint address.

When restoring a manual snapshot, you are setting it to a single point
in time. This influences the RPO value.

Automated backups are different, any 5 minute point in time.

Backups are restored and transation logs are replayed to bring DB to
desired point in time.

Restores aren't fast, think about RTO.

### RDS Read-Replicas

Kept in sync using **asyncronous replication**

It is written fully to the primary instance. Once its stored on disk, it
is then pushed to the replica. This means there could be a small lag.
These can be created in the same region or a different region. This is a
**cross region replication**

#### Why do these matter

READ performance

- 5 direct read-replicas per DB instance
- Each of these provides an additional instance of read performance
- This allows you to scale out read operations for an instance
- Read-replicas can chain, but lag will become a problem
- Can provide global performance improvements5

Availability Improvements

- Snapshots and backups improve RPO
- These don't help RTOs
- These offer near 0 RPO
- If the primary instance fails, you can promote a read-replica to take over
- Once it is promoted, it allows for read and write
- Only works for failures, these can replica data corruption, default back
to snapshots and backups
- Promotion cannot be reversed
- Global availability improvements provides global resilience

### Amazon Aurora

Aurora architecture is VERY different from RDS. At it's heart it uses a
**cluster**

- A single primary instance and 0 or more replicas
- The replicas within Aurora can be used for reads during normal operation
  - Provides benefits of RDS multi-AZ and read-replicas
- Aurora doesn't use local storage for the compute instances. An Aurora
cluster has a shared cluster volume. Provides faster provisioning.

Aurora cluster functions across different availability zones.

There is a primary instance and a number of replicas. The read applications from
applications can use the replicas.

There is a shared storage of **max 64 TiB, 6 Replicas, AZs**

All instances have access to all of these storage nodes. This replication
happens at the storage level. No extra resources are consumed during
replication.

By default the primary instance is the only one who can write. The replicas
will have read access.

Aurora automatically detect hardware failures on the shared storage. If there
is a failure, it immedietly repairs that area of disk. It automatically
recreates that data with no corruption.

With Aurora you can have up to 15 replicas and any of them
can be a failover target. The failover operation will be quicker because
it doesn't have to make any storage modifications. 

Cluster shared volume is based on SSD storage by default so high IOPS and low
latency.

Aurora cluster does not specify the amount of storage needed. This is based on
what is consumed.

High water mark - billed for the most used. Storage which is freed up can
be re-used.

Replicas can be added and removed without requiring storage provisioning.

#### Endpoints

Cluster endpoint - points at the primary instance

Reader endpoint - will load balance over the available replicas

As additional replicas are used for reads, this is load balanced over
replicas.

#### Costs

No free-tier option
Aurora doesn't support micro instances
Beyond RDS singleAZ (micro) Aurora provides best value.
Storage - GB-Month consumed, IO cost per request
100% DB size in backups are included

#### Aurora Restore, Clone and Backtrack

Backups in Aurora work in the same way as RDS

Restores create a new cluster.

Backtrack allows for you to roll back to a previous point in time. You can roll
back in place to a point before that corruption.

Enabled on a per cluster basis and can adjust the window backtrack can perform.

Fast clones make a new database much faster than copying all the data. It
references the original storage and only write the differences between
those two. It only copies the difference and only store changes
between the source data and the clone.

### Aurora Serverless

Provides a version of Aurora without worrying about the resources. 
It uses ACU - Aurora Capacity Units

For a cluster, you can set a min and max ACU based on the load

Can go to 0 and be paused.

Consumption billing per-second basis

Same resilience as Aurora (6 copies across AZs)

ACUs are stateless and shared across many AWS customers and have no local
storage.

They have access to cluster storage in the same way.

There is a shared proxy fleet. When a customer interacts with the data
they are actually communicating with the proxy fleet. The proxy fleet
brokers an application with the ACU and ensures you can scale in and out
without worrying about usage.

#### Aurora Serverless - Use Cases

Infrequently used applications. You only pay for resources as you consume
them on a per second basis.

New applications

Great for variable workloads. It can scale in and out based on demand

It is good for applications with unpredictable workloads.

It can be used for development and test databases because it can scale back
when not needed.

Great for multi-tenant applications. If your incoming load is directly
tied to more people, that's fine.

### Aurora Global Database

Replication from primary cluster volume to secondary replicas for read
operations.

Great for cross region disaster recovery and buisness continuity.

Global read scaling - low latency performance improvements for international
customers.

The application can perform read operations against the read database.

There is ~1s or less replication between regions. It is one way replication.

No additional CPU usage is needed, it happens on the storage layer.

Secondary regions can have 16 replicas.

All can be promoted to Read or Write with diasters.

There is currently max of 5 secondary regions.

### Aurora Multi-Master Writes

Allows an aurora cluster to have multiple instances with multiple writers.

The default aurora mode is single-master.

- This is one R/W and zero or more read only replicas.
- Cluster endpoint is normally used to write, read endpoint is used for load
balancing.

Aurora Multi-master has no endpoint or load balancing. An application
can connect with one or both of the instances inside a multi-master
cluster.

When one of the R/W nodes, it proposes all data be commited to all storage
of the clusters. They each confirm or deny if this change is allowed.

The writing instance is looking for a bunch of nodes to agree. If the group
rejects it, it cancels the write in error. If it commits, it will replicate
on all storage nodes.

In a Multi-master cluster, it will then copy into other masters.

This ensures storage is updated on in-memory cache's

If a writer goes down in a multi-master cluster, the application will shift
all future load over to the new writter with little to no downtime.

### Database Migration Service (DMS)

A managed database migration service. This runs using a replication instance.

Need to define the source and destination endpoints. These point at the
physical source and target databases.

One end point MUST be on AWS.