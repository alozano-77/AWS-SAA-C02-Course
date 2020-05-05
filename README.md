# SAA-C02 Notes

> These are my personal notes from Adrian Cantrill's (SAAC02) course.
Learning Aids from
[aws-sa-associate-saac02](https://github.com/acantril/aws-sa-associate-saac02).
There will be errors, so please purchase his course to get the original content
and show support https://learn.cantrill.io.

## Table of Contents

- [Intro-to-Cloud](#Intro-to-Cloud)
- [AWS-Fundamentals](#AWS-Fundamentals)
- [IAM-Accounts-AWS-Organizations](#IAM-Accounts-AWS-Organizations)

---

## Intro-to-Cloud

Cloud computing provides

1. On-Demand Self-Service: Provision and terminate using a UI/CLI without
human interaction.
2. Broad Network Access: Access services over any networks on any devices using
standard protocols and methods.
3. Resource Pooling: Economies of scale, cheaper service.
4. Rapid Elasticity: Scale up and down automatically in response to system load.
5. Measured Service: Usage is measured. Pay only for what you consume.

### Public vs Private vs Multi Cloud

- Public Cloud: using 1 public cloud such as AWS, Azure, Google Cloud.
- Private Cloud: using on-premises real cloud. Must meet 5 requirements.
- Multi-Cloud: using more than 1 public cloud in one deployment.
- Hybrid Cloud: using public and private clouds in one environment
  - This is **NOT** using Public Cloud and Legacy on-premises hardware.

### Cloud Service Models

The *Infrastructure Stack* or *Application Stack* contains multiple components
that make up the total service. There are parts that **you** manage as well
as portions the **vendor** manages. The portions the vendor manages and you
are charged for is the **unit of consumption**

1. On-Premises: The individual manages all components from data to facilities.
Provides the most flexibility, but also most IT intensive.
2. Data Center Hosting: Place equipment in a building managed by a vendor.
You pay for the facilities only.
3. Infrastructure as a Service (IaaS): Vendor manages facilities and everything
else related to servers up to the OS. You pay per second or minute for the OS
used to the vendor. Lose some flexibility, but big risk reductions.
4. Platform as a Service (PaaS): Good for running an application only. The
unit of consumption is the runtime environment. You manage the application
and the data, but the vendor manges all else.
5. Software as a Service (SaaS): You consume the software as a service. This
can be Outlook or Netflix. There are almost no risks or additional costs, but
very little control.

There are additional services such as *Function as a Service*,
*Container as a Service*, and *DataBase as a Service* which be explained later.

---

## AWS-Fundamentals

### Public vs Private Services

Refers to the networking only, not permissions.

- Public Internet: AWS is a public cloud platform and connected to the public
internet. It is not on the public internet, but is next to it.
- AWS Public Zone: Attached to the Public Internet.
S3 Bucket is hosted in the Public Zone, not all services are.
Just because you connect to a public service,
that does not mean you have permissions to access it.
- AWS Private Zone: No direct connectivity is allowed between the AWS Private
Zone and the public cloud unless this is configured for that service.
This is done by taking a part of the private service and projecting it into the
AWS public zone which allows public internet to make inbound or outbound
connections.

### [AWS Global Infrastructure](https://www.infrastructure.aws/)

#### Regions

AWS Region is an area of the world they have selected for a full deployment of
AWS infrastructure.

Areas such as countries or states

- Ohio
- California
- Singapore
- Beijing
- London
- Paris

AWS can only deploy regions as fast as their planning allows.
Regions are often not near their customers.

#### AWS Edge Locations

Local distribution points. Useful for services such as Netflix so they can store
data closer to customers for low latency high speed transfers.

If a customer wants to access data stored in Brisbane, they will stream data
from the Sydney Region through an Edge Location hosted in Brisbane.

#### AWS Management

Regions are connected together with high speed networking.
Some services such as EC2 need to be selected in a region.
Some services are global such as IAM

#### Region's 3 Benefits

- Geographical Separation
  - Useful for natural disasters
  - Provide isolated fault domain
  - Regions are 100% isolated
- Geopolitical Separation
  - Different laws change how things are accessed
  - Stability from political events
- Location Control
  - Tune architecture for performance
  - Duplicate infrastructure at closer points to customers

#### Regions and AZs

Region Name: Asia Pacific (Sydney)
Region Code: ap-southeast-2

AWS will provide between 2 and 6 AZs per region.
AZs are isolated compute, storage, networking, power, and facilities.
Components are allowed to distribute load and resilience by using multiple zones.

AZs are connected to each other with high speed redundant networks.

#### Service Resilience

1. Globally Resilient: IAM or Route 53. No way for them to go down. Data is
replicated throughout multiple regions.
2. Region Resilient: Operate as separate services in each region. Generally
replicate data to multiple AZs in that region.
3. AZ Resilient: Run from a single AZ. It is possible for hardware to fail in an
AZ and the service to keep running because of redundant equipment, but should
not be relied on.

### AWS Default VPC

VPC is a virtual network inside of AWS.
A VPC is within 1 account and 1 region which makes it regionally resilient.
A VPC is private and isolated until decided otherwise.

One default VPC per region. Can have many custom VPCs which are all private
by default.

#### Default VPC Facts

VPC CIDR - defines start and end ranges of the VPC.
IP CIDR of a default VPC is always: **172.31.0.0/16**

Configured to have one subnet in each AZ in the region by default.

Subnets are given one section of the IP ranges for the default service.
In general do not use the Default VPC in a region because it is not flexible.

Default VPC is large because it uses the /16 range.
A subnet is smaller such as /20
The higher the / number is, the smaller the grouping.

Two /17's will fit into a /16, sixteen /20 subnets can fit into one /16.

### Elastic Compute Cloud (EC2)

Default compute service. Provides access to virtual machines called instances.

**IaaS** - Infrastructure as as Service

The unit of consumption is an instance
EC2 instance is configured to launch into a single VPC subnet.
Private service by default, public access must be configured.
The VPC needs to support public access. If you use a custom VPC then you must
handle the networking on your own.

EC2 deploys into one AZ. If it fails, the instance fails.

Different sizes and capabilities all use On-Demand Billing - Per second.
Only pay for what you consume.

Charge for running the instance, CPU, memory and storage.
Extra cost for any commercial software the instance deploys with.

Local on-host storage or **Elastic Block Storage**

Pricing based on:

- CPU
- Memory
- Storage
- Networking

#### Running State

Charged for all four categories.

- Running on a physical host using CPU.
- Using memory even with no processing.
- OS is stored on disk allocated
- Networking is always ready to transfer information.

#### Stopped State

Charged for EBS storage  only.

- No CPU resources are being consumed
- No memory is being used
- Networking is not running
- Storage is allocated to the instance for the OS.

#### Terminated State

No charges, deletes the disk and prevents all future charges.

#### AMI (Server Image)

AMI can use used to create an instance or created from an instance.

Contains:

- Permissions: control which accounts can and can't use the AMI.

  - Public: Anyone can launch it.

  - Owner - Implicit allow, only the owner can use it  spin up new instances

  - Explicit - owner grants access to AMI for specific AWS accounts

- Root Volume: contain the **Boot Volume**

- Block Device Mapping: links the volumes that the AMI has and
how they're presented to the operating system. Determines which volume is a
boot volume and which volumes is a data volume.

#### Connecting to EC2

- Windows using RDP (Remote Desktop Protocol), Port 3389
- Linux SSH protocol, Port 22

Login to the instance using an SSH key pair.
Private Key - Stored on local machine to initiate connection.
Public Key - AWS places this key on the instance.

### S3 (Default Storage Service)

Global Storage platform. Runs from all regions and is a public service.
Can be accessed anywhere from the internet with an unlimited amount of users.

This should be the default storage platform

S3 is an object storage, not file, or block storage.
You can't mount an S3 Bucket.

#### Objects

Can be thought of a file. Two main components:

- Object Key: File name in a bucket
- Value: Data or contents of the object
  - Zero bytes to 5 TB

Other components:

- Version ID
- Metadata
- Access Control
- Sub resources

#### Buckets

- Created in a specific AWS Region.
- Data has a primary home region. Will not leave this region unless told.
- Blast Radius = Region
- Unlimited number of Objects
- Name is globally unique
- All objects are stored within the bucket at the same level.

If the objects name starts with a slash such as `/old/Koala1.jpg` the UI will
present this as a folder. In actuality this is not true, there are no folders.

### CloudFormation Basics

Templates can modify infrastructure to, create, update and delete.

Written in YAML or JSON

```YAML
## This is not mandatory unless a description is added
AWSTemplateFormatVersion: "version date"

## Give details as to what this template does.
## If you use this section, it MUST immediately follow the AWSTemplateFormatVersion.
Description:
  A sample template

## Can control the command line UI. The bigger your template, the more likely
## this section is needed
Metadata:
  template metadata

## Prompt the user for more data. Name of something, size of instance,
## data validation
Parameters:
  set of parameters

## Another optional section. Allows lookup tables, not used often
Mappings:
  set of mappings

## Decision making in the template. Things will only occur if a condition is met.
## Step 1: create condition
## Step 2: use the condition to do something else in the template
Conditions:
  set of conditions

Transform:
  set of transforms

## The only mandatory field of this section
Resources:
  set of resources

## Once the template is finished it can return data or information.
## Could return the admin or setup address of a word press blog.
Outputs:
  set of outputs
```

#### Resources

An example which creates an EC2 instance

```YAML
Resources:
  Instance: ## Logical Resource
    Type: 'AWS::EC2::Instance' ## This is what will be created
    Properties: ## Configure the resources in a particular way
      ImageId: !Ref LatestAmiId
      Instance Type: !Ref Instance Type
      KeyName: !Ref Keyname
```

Once a template is created, AWS will make a stack. This is a living and active
representation of a template. One template can create infinite amount of stacks.

For any **Logical Resources** in the stack,
CF will make a corresponding **Physical Resources** in your AWS account.

It is cloud formations job to keep the logical and physical resources in sync.

A template can be updated and then used to update the same stack.

### CloudWatch Basics

Collects and manages operational data on your behalf.

Three products in one

- Metrics: data relating to AWS products, apps, on-prem solutions
- Logs: collection, monitoring
- Events: event hub
  - If an AWS service does something, CW events can perform another action
  - Generate an event to do something at a certain time of day or time of week.

#### Namespace

Container for monitoring data.
Naming can be anything so long as it's not `AWS/service` such as `AWS/EC2`.
This is used for all metric data of that service

#### Metric

Time ordered set of data points such as:

- CPU Usage
- Network IN/OUT
- Disk IO

This is not for a specific server. This could get things from different servers

Anytime CPU Utilization is reported, the **datapoint** will report

- Timestamp = 2019-12-03
- Value = 98.3

**Dimensions** separate data points for different **things** or
**perspectives** within the same metric

#### Alarms

Has two states `ok` or `alarm`.State can send an SNS or action.
Third state can be insufficient data state. Not a problem, just wait.

### Shared Responsibility Model

AWS: Responsible for security **OF** the cloud

Customer: Responsible for security **IN** the cloud

### High Availability (HA), Fault-Tolerance (FT), and Disaster Recover (DR)

#### High Availability (HA)

- Aims to **ensure** an agreed level of operational **performance**, usually
**uptime**, for a **higher than normal period**
- Instead of diagnosing the issue, swap it out.
- Redundant hardware to minimize downtown
- User disruption is not ideal, but is allowed
  - The user might need to log back in or lose some data on their screen.
- Maximizing a system's uptime
  - 99.9% (Three 9's) = 8.7 hours downtime per year.
  - 99.999 (Five 9's) = 5.26 minutes downtime per year.

#### Fault-Tolerance (FT)

- System can **continue operating properly**
in the event of the **failure of some** (one or more faults within) of its
**components**
- Fault tolerance is much more complicated than high availability and more
expensive. Outages must be minimized and the system needs levels of
redundancy.
- An airplane is an example of system that needs Fault Tolerance. It has
more engines than it needs for redundancy.

Example:
A patient is waiting for a life saving surgery and is under anesthetic.
While being monitored, the life support system is dosing medicine.
This type of system cannot only be highly available, even a movement of
interruption is deadly.

#### Disaster Recover (DR)

- Set of policies, tools and procedures to **enable the recovery** or
**continuation** of **vital** technology infrastructure and systems
**following a natural or human-induced disaster**.
- DR can largely be automated to eliminate the time for recovery and errors.

This involves:

- Pre-planning
  - Ensure plans are in place for extra hardware
  - Do not store backups at the same site as the system
- DR Processes
  - Cloud machines ready when needed

This is designed to keep the crucial and non replaceable parts of the
system in place.

### Domain Name System (DNS)

DNS is a discovery service. Translates machines into humans and vice-versa.
It is a huge database and has to be distributed.

Parts of the DNS system

- DNS Client: Piece of software running on the OS for a device you're using.
- Resolver: Software on your device or server which queries DNS on your behalf.
- Zone: A part of the DNS database.
  - This would be www.amazon.com
  - What the data is, the substance
- Zonefile: physical database for a zone
  - How physically that data is stored
- Nameserver: where zonefiles are hosted

Steps:

Find the Nameserver which hosts a particular Zonefile.
Query that Nameserver for a record with that Zone.
It then passes the information back to the client.

#### DNS Root

The starting point of DNS.
DNS names are read right to left with multiple parts separated by periods.

`www.netflix.com.`

The period is assumed to be there in a browser when it's not present.
The DNS Root is hosted on DNS Root Servers (13). These are hosted
by 12 major companies.

**Root Hints** is a pointer to the DNS Root server

Process

1. DNS client asks DNS Resolver for IP address of a given DNS name.
2. Using the Root Hints file, the DNS Resolver communicates with one or
more of the root servers to access the root zone and begin the process
of finding the IP address.

The Root Zone is organized by IANA (Internet Assigned Numbers Authority).
Their job is to manage the contents of the root zone. IANA is in charge
of the DNS system because they control the root zone.

#### DNS Hierarchy

Assuming a laptop is querying DNS directly for www.amazon.com and using
a root hints file to know how to access a root server and query the root zone.

- When something is trusted in DNS, it is an **authority**.
- One piece can be authoritative for root.
- One piece can be authoritative for amazon.com
- The root zone is the start and the only thing trusted in DNS.
- The root zone can delegate a part of itself to another zone or entity.
- That someone else then becomes authoritative for that piece of itself only.
- The root zone is just a database of the top level domains.

The top level domains are the only things to the left of the DNS name.

- `.com` or `.org` are generic top level domains (GTLD)
- `.uk` is a country code top level domains (CCTLD)

**Registry** maintains the zones for a TLD (e.g .ORG)
**Registrar** has relationships with the .org TLD zone manager
allowing domain registration

### Route53 Fundamentals

- Registers domains
- Can Host Zone Files on managed nameservers
- This is a global service, no need to pick a region
- Globally Resilience
  - Can operate with failure in one or more regions

#### Register Domains

Has relationships with all major registries

- Route 53 will check with the top level domain to see if the name is available
- Router 53 creates a zonefile for the domain to be registered
- Allocates nameservice for that zone
  - Generally four of these for one individual zone
  - This is a hosted zone
  - The zone file will be put on these four managed nameservers
- Router 53 will communicate with the `.org` registry and add the nameserver
records into the zone file for the top level domain.
  - This is done with a nameserver record.

#### Route53 Details

**Zonefiles** in AWS
Hosted on four managed name servers

- Can be **public** or **private**

### DNS Record

- Nameserver (NS): Allows delegation to occur in the DNS.
- A and AAAA Records: Maps the host to a v4 or v6 host type. Most of the time
you will make both types of record, A and AAAA.
- CNAME Record Type: Allows DNS shortcuts to reduce admin overhead.
CNAMES cannot point directly at an IP address and only another name.
- MX records: How emails are sent. They have two main parts:
  - Priority: Lower values for the priority field are higher priority.
  - Value
    - If it is just a host, it will not have a dot on the right. It is assumed
to be part of the same zone as the host.
    - If you include a dot on the right, it is a ***fully qualified domain name***
- TXT Record: Allows you to add arbitrary text to a domain.
One common usage is to prove domain ownership.

#### TTL - Time To Live

This is a numeric setting on DNS records in seconds.
Allows the admin to specify how long the query can be stored
at the resolver server.
If you need to upgrade the records, it is smart to lower the TTL value first.

Getting the answer from an Authoritative Source is known as an
**Authoritative Answer**.

If another client queries the same thing, they will get back a
**Non-Authoritative** response.

---

## IAM-Accounts-AWS-Organizations

### IAM Identity Policies

Identity Policies are attached to AWS Identities which are
IAM users, IAM groups, and IAM roles. These are a set of security statements
that ALLOW or DENY access to AWS resources.

When an identity attempts to access AWS resources, that identity needs
to prove who it is to AWS, a process known as **Authentication**.
Once authenticated, that identity is known as an **authenticated identity**

#### Statement Components

- Statement ID (SID): Optional field that should help describe
  - The resource you're interacting
  - The actions you're trying to perform
- Effect: is either `allow` or `deny`.
  - It is possible to be allowed and denied at the same time
- Action are formatted `service:operation`. There are three options:
  - specific individual action
  - wildcard as an action
  - list of multiple independent actions
- Resource: similar to action except for format `arn:aws:s3:::catgifs`

#### Priority Level

- Explicit Deny: Denies access to a particular resource cannot be overruled.
- Explicit Allow: Allows access so long there is not an explicit deny.
- Default Deny (Implicit): IAM identities start off with no resource access.

#### Inline Policies and Managed Policies

- Inline Policy: grants access and assigned on each accounts individually.
- Managed Policy (best practice): one policy is applied to all users at once.

### IAM Users

Identity used for anything requiring **long-term** AWS access

- Humans
- Applications
- Service Accounts

If you can name a thing to use the AWS account, this is an IAM user.

When a **principal** wants to **request** to perform an action,
it will **authenticate** against an identity within IAM. An IAM user is an
identity which can be used in this way.

There are two ways to authenticate:

- Username and Password
- Access Keys (CLI)

Once the **Principal** has authenticated, it becomes an **authenticated identity**

#### Amazon Resource Name (ARN)

Uniquely identify resources within any AWS accounts.

This allows you to refer to a single or group of resources.
This prevents individual resources from the same account but in
different regions from being confused.

ARN generally follows the same format:

```bash
arn:partition:service:region:account-id:resource-id
arn:partition:service:region:account-id:resource-type/resource-id
arn:partition:service:region:account-id:resource-type:resource-id
```

- partition: almost always `aws` unless it is china `aws-cn`
- region: can be a double colon (::) if that doesn't matter
- account-id: the account that owns the resource
  - EC2 needs this
  - S3 does not need account-id because its globally unique
- resource-type/id: changes based on the resource

An example that leads to confusion:

- arn:aws:s3:::catgifs
  - This references an actual bucket
- arn:aws:s3:::catgifs/*
  - This refers to objects in that bucket, but not the bucket itself.

These two ARNs do not overlap

#### IAM FACTS

- 5,000 IAM users per account
- IAM user can be a member of 10 groups

### IAM Groups

Containers for users. **You cannot login to IAM groups** They have no
credentials of their own. Used solely for management of IAM users.

Groups bring two benefits

1. Effective administrative style management of users based on the team
2. Groups can have Inline and Managed policies attached.

AWS merges all of the policies from all groups the user is in together.

- The 5000 IAM user limit applies to groups.
- There is **no all users** IAM group.
  - You can create a group and add all users into that group, but it needs to be
created and managed on your own.
- No Nesting: You cannot have groups within groups.
- 300 Group Limit per account. This can be fixed with a support ticket.

**Resource Policy** A bucket can have a policy associated with that bucket.
It does so by referencing the identity using an ARN (Amazon Reference Name).
A policy on a resource can reference IAM users and IAM roles by the ARN.
A bucket can give access to one or more users or one or more roles.

**GROUPS ARE NOT A TRUE IDENTITY**
**THEY CAN'T BE REFERENCED AS A PRINCIPAL IN A POLICY**

An S3 Resource cannot grant access to a group, it is not an identity.
Groups are used to allow permissions to be assigned to IAM users.

### IAM Roles

A single thing that uses an identity is an IAM User.

IAM Roles are also identities that are used by large groups of individuals.
If have more than 5000 principals, it could be a candidate for an IAM Role.

IAM Roles are **assumed** you become that role.

This can be used short term by other identities.

IAM Users can have inline or managed policies which control which permissions
the identity gets within AWS

Policies which grant, allow or deny, permissions based on their associations.

IAM Roles have two types of roles can be attached.

- Trust Policy: Specifies which identities are allowed to assume the role.
- Permissions Policy: Specifies what the role is allowed to do.

If an identity is allowed on the **Trust Policy**, it is given a set
of **Temporary Security Credentials**. Similar to access keys except they
are time limited to expire. The identity will need to renew them by
reassuming the role.

Every time the **Temporary Security Credentials** are used, the access
is checked against the **Permissions Policy**. If you change the policy, the
permissions of the temp credentials also change.

Roles are real identities and can be referenced within resource policies.

Secure Token Service (sts:AssumeRole) this is what generates the temporary
security credentials (TSC).

### When to use IAM Roles

Lambda Execution Role.
For a given lambda function, you cannot determine the number of principals
which suggested a Role might be the ideal identity to use.

- Trust Policy: to trust the Lambda Service
- Permission Policy: to grant access to AWS services.

When this is run, it uses the sts:AssumeRole to generate keys to
CloudWatch and S3.

It is better when possible to use an IAM Role versus attaching a policy.

#### Emergency or out of the usual situations

Break Glass Situation - There is a key for something the team does not
normally have access to. When you break the glass, you must have a reason
to do.
A role can have an Emergency Role which will allow further access if
its really needed.

#### Adding AWS into existing corp environment

You may have an existing identity provider you are trying to allow access to.
This may offer SSO (Single Sign On) or over 5000 identities.
This is useful to reuse your existing identities for AWS.
External accounts can't be used to access AWS directly.
To solve this, you allow an IAM role in the AWS account to be assumed
by one of the active directories.
**ID Federation** allowing an external service the ability to assume a role.

#### Making an app with 1,000,000 users

**Web Identity Federation** uses IAM roles to allow broader access.
These allow you to use an existing web identity such as google, facebook, or
twitter to grant access to the app.
We can trust these web identities and allow those identities to assume
an IAM role to access web resources such as DynamoDB.
No AWS Credentials are stored on the application.
Can scale quickly and beyond.

#### Cross Account Access

You can use a role in the partner account and use that to upload objects
to AWS resources.

### AWS Organizations

Without an organization, each AWS account needs it's own set of IAM users
as well as individual payment methods.
If you have more than 5 to 10 accounts, you would want to use an org.

Take a single AWS account **standard AWS account** and create an org.
The standard AWS account then becomes the **master account**.
The master account can invite other existing standard AWS accounts. They will
need to approve their joining to the org.

When standard AWS accounts become part of the org, they
become **member accounts**.
Organizations can only have one **master accounts** and zero or more
**member accounts**

#### Organization Root

This is a container that can hold AWS member accounts or the master account.
It could also contain **organizational units** which can contain other
units or member accounts.

#### Consolidated billing

The individual billing for the member accounts is removed and they pass their
billing to the master account.
Inside an AWS organization, you get a single monthly bill for the master
account which covers all the billing for each users.
Can offer a discount with consolidation of reservations and volume discounts

#### Create new accounts in an org

Adding accounts in an organization is easy with only an email needed.
You no longer need IAM users in each accounts. You can use IAM roles
to change these.
It is best to have a single AWS account only used for login.
Some enterprises may use an AWS account while smaller ones may use the master.

#### Role Switching

Allows you to switch between accounts from the command line

### Service Control Policies

Can be used to restrict what member accounts in an org can do.

JSON policy document that can be attached:

- To the org as a whole by attaching to the root container.
- A specific Organizational Unit
- A specific member only.

The master account cannot be restricted by SCPs which means this
should not be used because it is a security risk.

SCPs limit what the account, **including root** can do inside that account.
They don't grant permissions themselves, just act as a barrier.

#### Allow List vs Deny List

Deny list is the default.

When you enable SCP on your org, AWS applies `FullAWSAccess`. This means
SCPs have no effect because nothing is restricted. It has zero influence
by themselves.

```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "*",
    "Resource": "*"
  }
}
```

SCPs by themselves don't grant permissions. When SCPs are enabled,
there is an implicit deny.

You must then add any services you want to Deny such as `DenyS3`

```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Deny",
    "Action": "s3:*",
    "Resource": "*"
  }
}
```

**Deny List** is a good default because it allows for the use of growing
services offered by AWS. A lot less admin overhead.

**Allow List** allows you to be conscience of your costs.

- To begin, you must remove the `FullAWSAccess` list
- Then, specify which services need to be allowed access.
- Example `AllowS3EC2` is below

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:*",
            "ec2:*"
        ],
    "Resource": "*"
    }
  ]
}
```

### CloudWatch Logs

This is a public service, this can be used from AWS VPC or on premise
environment.

This allows to **store**, **monitor** and **access** logging data.

- This is a piece of information data and a timestamp
- Can be more fields, but at least these two

Comes with some AWS Integrations.
Security is provided with IAM roles or Service roles
Can generate metrics based on logs **metric filter**

#### Architecture of CloudWatch Logs

It is a regional service `us-east-1`

Need logging sources such as external APIs or databases. This sends
information as **log events**. These are stored in **log streams**. This is a
sequence of log events from the same source.

**Log Groups** are containers for multiple logs streams of the same
type of logging. This also stores configuration settings such as
retention settings and permissions.

Once the settings are defined on a log group, they apply to all log streams
in that log group. Metric filters are also applied on the log groups.

### CloudTrail Essentials

Concerned with who did what.

Logs API calls or activities as **CloudTrail Event**

Stores the last 90 days of events in the **Event History**. This is enabled
by default and is no additional cost.

To customize the service you need to create a new **trail**.
Two types of events. Default only logs Management Events

- Management Events:
Provide information about management operations performed on resources
in the AWS account. Create an EC2 instance or terminating one.

- Data Events:
Objects being uploaded to S3 or a Lambda function being invoked. This is not
enabled by default and must be enabled for that trail.

#### CloudTrail Trail

Logs events for the AWS region it is created in. It is a regional service.

Once created, it can operate in two ways

- One region trail
- All region trail
  - Collection of trails in all regions
  - When new regions are added, they will be added to this trail automatically

Most services log events in the region they occur. The trail then must be
a one region trail in that region or an all region trail to log that event.

A small number of services log events globally to one region. Global services
such as IAM or STS or CloudFront always log their events to `us-east-1`

A trail must have this enabled to have this logged.

AWS services are largely split into regional services or global services.

When the services log, they log in the region they are created or
to `us-east-1` if they are a global service.

A trail can store events in an S3 bucket as a compressed JSON file. It can
also use CloudWatch Logs to output the data.

CloudTrail products can create an organizational trail. This allows a single
management point for all the API's and management events for that org.

#### CloudTrail Exam Powerup

- It is enabled by default for 90 days without S3
- Trails are how you configure S3 and CWLogs
- Management events are only saved by default
- IAM, STS, CloudFront are Global Service events and log to `us-east-1`
  - Trail must be enabled to do this
- NOT REALTIME - There is a delay. Approximately 15 minute delay

#### CloudTrail Pricing

https://aws.amazon.com/cloudtrail/pricing/
