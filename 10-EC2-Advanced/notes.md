## Advanced EC2

### Bootstrapping EC2 using User Data

Bootstrapping is a process where scripts or other config steps can be run when
an instance is first launched. This allows an instance to be brough to service
in a particular configured state.

In systems automation, bootstrapping allows the system to self configure
or perform some self configuration steps. In AWS this is
**EC2 Build Automation**.

This could perform some software installs and post install configs.

Bootstrapping is done using user data - accessed via the meta-deta IP

<http://169.254.169.254/latest/user-data>

Anything you pass in is executed by the instance OS. It is excecuted
only once on launch!

EC2 doesn't validate the user data. You can tell EC2 to pass in trash data
and the data will be passed. The OS needs to understand the user data.

#### Bootstrapping Architecture

An AMI is used to launch an EC2 instance in the usual way to create
an EBS volume that is attached to the EC2 instance. This is based on the
block mapping inside the AMI.

Now the EC2 service provides some userdata through to the EC2 instance.
There is software within the OS running which is designed to look at the
metadata IP for any user data. If it sees any user data, it executes
this on launch of that instance.

This is treated like any other script the OS runs. At the end of running
the script, the instance will be in:

- Running state and ready for service
- Bad config but still likely running
  - The instance will probably still pass its checks
  - It will not be configured as you excpected

#### User Data Key Points

EC2 doesn't know what the user data contains, it's just a block of data.

The user data is not secure, anyone can see what gets passed in. For this
reason it is important not to pass passwords or long term credentials.

User data is limited to 16 KB in size. Anything larger than this will
need to pass a script to download the larger set of data.

User data can be modified if you stop the instance, change the user
data, then restart the instance.

The contents are only excecuted once at launch.

#### Boot-Time-To-Service-Time

How quickly after you launch an instance is it ready for service. This
includes the time for EC2 to configure the instance and any software
downloads that are needed for the user.

When looking at an AMI, this can be measured in minutes.

AMI baking will front load the time needed.

The optimal way is to use AMI baking

### AWS::CloudFormation::Init

**cfn-init** is a helper script installed on EC2 OS.

This is a simple configuration management system.

Procedural (user Data) vs Desired State (cfn-init)

Packages, groups, users, sources, files, commands, services, and ownerships.

This is executed as any other command by passing into the instance with
the user-data.

This is provided with directives via Metadata and AWS::CloudFormation::Init on
a CFN resource

#### cfn-init explained

Starts off with a **cloud formation template**
This has a logical resource within it which is to create an EC2 instance.

This has a specific section called `Metadata:`

This then passes in the information passed in as `UserData`

cfn-init gets variables passed into the userdata by cloud formation

It knows the desired state desired by the user and can work towards a
final stated configuration

This can monitor the userdata and change things as the EC2 data changes.

#### CreationPolicy and Signals

The template has a specific part designated signals

A creation policy is added to a logical resource. It is provided a
timeout value. The resource itself will trigger a signal that cloud formation
can continue

### EC2 Instance Roles

IAM roles are the best practice ways for services to be granted permissions.

Roles that an instance can assume to grant permissions for resources within.

Starts with an IAM role with a permissions policy.

EC2 instance role allows the EC2 service to assume that role.

The **instance profile** is the item that allows the permissions inside
the instance.

When IAM roles are assumed, you are provided temporary roles based on the
permission assigned to that role. These credentials are passed through
instance **meta-data**.

EC2 and the secure token service ensure the credentials never expire.

Key facts

- Credentials are inside meta-data
- iam/security-credentials/role-name
- automatically rotated - always valid
- the resources need to check the meta-data periodically
- should always use roles compared to storing long term credentials
- CLI tools use role credentials automatically

### AWS System Manager Parameter Store

Passing secrets into an EC2 instance is bad practice because anyone
who has access to the meta-data has access to the secrets.

Parameter store allows for storage of **configuration** and **secrets**

- Strings
- StringList
- SecureString

You can store license codes, database strings, and full configs and passwords.

Parameter store allows for hierarchies and versioning.

It can store plaintext and ciphertext. This integrates with **kms** to
encrypt passwords.

Allows for public parameters such as the latest AMI parameter to be stored
and referenced for EC2 creating.

This is a public service so any services needs access to the public sphere or
to be an AWS service.

Applications, EC2 instances, lambda functions can all request access to
parameter store.

This is tied closely to IAM and could use long term credentials such
as access keys, or short term use of IAM roles.

Allows for simple or complex sets of parameters.

### System and Application Logging on EC2

Cloudwatch monitors the outside metrics of an instance
Cloudwatch logs is for logging

Neither natively capture data inside an instance.

CloudWatch Agent is required for OS visible data. It sends this data into CW

For CW to function, it needs configuration and permissions in addition
to having to install the cloud watch agent.

The cloudwatch agent needs to know what information to inject
into cloud watch and cloud watch logs.

The agent needs some permissions to interact with AWS. This is done with an
IAM role as best practice. The IAM role has permissions to interact
with CW logs. The IAM role is attached to the instance which provides
the instance and anything running on the instance, permissions to manage
CW logs.

The data requested is then injected in CW logs.

There is one log group for each individual log we want to capture

There is one log stream for each group for each instance that needs
management.

We can use parameter store to store the configuration for the CW agent.

### EC2 Placement Groups

#### Cluser - Pack instances close together

Achieves the highest level of performance available with EC2.

Best practice is to launch all of the instances within that group at the
same time.

If you launch with 9 instances and AWS places you in a place with capacity
for 12, you are now limited in how many you can add.

Cluser placements need to be part of the same AZ. The idea with cluster
placement groups are generally the same rack, but they can even be the same
EC2 host.

All members have direct connections to each other. They can achieve
10 Gbps single stream vs 5 Gbps normally. They also have the lowest
latency and max PPS possible in AWS.

If the hardware fails, the entire cluster will fail.

##### Cluster Exams

Clusters can't span AZs. The first AZ used will lock down the cluster.

They can span VPC peers.

Requires a supported instance type.

Best practice to use the same type of instance and launch all at once.

This is the only way to achieve **10Gbps SINGLE stream**, other data metrics
assume multiple streams.

#### Spread - Keep instances seperated

This provides the best resillience and availability.

Spread groups can span multiple AZs. Information will be put on distinct
racks with their own network or power supply. There is a limit of 7 instances
per AZ. The more AZs in a region, the more instances inside a spread placement
group.

##### Spread Exams

Provides the highest level of availability and resillience. Each instance
by default runs from a different rack.

7 instances per AZ is a hard limit.

Not supported for dedicated instances or hosts.

Use case: small number of critical instances that need to be kept seperated
from each other. Several mirrors of an application

#### Partition - groups of instances spread apart

Spread placement groups are handled by default natively by AWS.

If a problem occurs with one rack's networking or power, it will
at most take out one instance.

The main difference is you can launch as many instances in each partition
as you desire.

When you launch a partition group, you can allow AWS decide or you can
specifically decide.

##### Parition Exams

7 paritions maximum for each AZ

Instances can be placed into a specific parition, or AWS can pick.

This is not supported on dedicated hosts.

Great for HDFS, HBase, and Cassandra

### EC2 Dedicated Hosts

EC2 host allocated to you in its entirety.

Pay for the host itself which is designed for a family of instances.

No instance charges.

You can pay for a host on-demand or reservation with 1 or 3 year terms.

The host hardware has physical sockets and cores. This dictates to how
many instances can be run.

Hosts are designed for a specific size and family. If you purchase one host, you
configure what type of instances you want to run on it. With the older
system you cannot mix and match. The new nitro system allows for mixing and
matching host size.

#### Dedicated Hosts Limitations

AMI Limits, some versions can't be used

Amazon RDS instances are not supported

Placement groups are not supported for dedicated hosts.

Hosts can be shared with other organization accounts using **RAM**

This is mostly used for licensing problems related to ports.

### Enchanced Networking

Enchanced networking uses SR-IOV - The physical network interface is aware
of the virtualization. Each instance is given exclusive access to one part
of a physical network interface card.

There is no charge for this and is available on most EC2 types.

It allows for higher IO and lower host CPU usage

This provides more bandwidth and higher packet per seconds.

In general this provides lower latency.

#### EBS Optimized

Historically network was shared, data and EBS.

EBS optimized there has been dedicated capacity for EBS. Most instances support
andh ave this enabled by default.

Some support, but enabling costs extra. This is generally enabled and comes
with standard instances.