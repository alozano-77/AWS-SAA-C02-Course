# AWS Fundamentals

## Public vs Private Services

Refers to the networking only, not permissions

### Public Internet

- This is where Netflix and accessible sites are hosted

AWS is next to the Public Internet, but not always connected to it

### AWS Public Zone

Attached to the Public Internet

S3 Bucket is hosted in the Public Zone, not all services are

Just because you connect to a service does not mean you have permissions to access it.

### AWS Private Zone

No direct connectivity is allowed between the AWS Private Zone and the public cloud unless this is allowed.

EC2 service can be configured to make outgoing or incoming connections

- This is done by taking a part of the private service and projecting it into the AWS public zone which allows Public Internet to make inbound or outbound connections

By default only things that are connected to other private networks are allowed to communicate

## AWS Global Infrastructure

AWS_Globally

<https://www.infrastructure.aws/>

AWS Region is an area of the world they have selected for a full deployment of AWS infrastrure

### Regions 

Areas such as countries or states

- Ohio
- California
- Singapore
- Beijing
- London
- Paris

AWS can only deploy regions as fast as their planning allows. Regions are often not near their customers

### AWS Edge Locations

Local distribution points. Useful for Netflix so they can store data closer to customers for low latency high speed transfers.

If a customer wants to access data stored in Brisbane, they will stream data from the Sydney Region through an Edge Location hosted in Brisbane

### AWS Managament

Regions are connected together with high speed networking

Some services such as EC2 need to be selected in a region. Some services are global such as IAM

### Regions's 3 Benefits

#### Geographical Seperation

- Useful for natural disasters
- Provide isolated fault domain
- Regions are 100% isolated

#### Geopolitical Seperation

- Different laws change how things are accessed
- Stability from political events

#### Location Control

- Tune architecture for performance
- Duplicate infrastructure at closer points to customers

### Regions and AZs

Australia's Code
Region Name: Asia Pacific (Sydney)
Region Code: ap-southeast-2

AWS will provide between 2 and 6 availability zones.

The zones are isolated computure, storage, networking, power, and facilities in a region

Components are allowed to distribute load and resillance by using multiple zones.

Availability zones are connected between each other with high speed redudant networks.

### Service Resilience

#### Globally Resilient

IAM or Route 53. No way for them to go down

#### Region Resilient

This is a service distributed over multiple AZs in a Region. Not common

#### AZ Resilent

It is possible for hardware to fail in an AZ and the service to keep running because of reduntant equiptment

## AWS Default VPC

### VPC [Virtual Private Cloud] Basics

This connects your AWS cloud network to on-premises hardware when creating a hybrid network. This can also connect together different cloud networks such as Azure or Google Cloud

A VPC is within 1 account and 1 region
    This is private and isolated until decided otherwise

### Default VPC and Custom VPC

One default VPC per region

Many Custom VPC's can be created.
    These are 100% private by default

### Default VPC

VPC CIDR - defines start and end ranges of the VPC

Default VPC is always configured as 172.31.0.0/16

Configured to have one subnet in each AZ in the region

Subnets are given one section of the IP ranges for the default service.

#### Default VPC Facts

One per region. This can be removed, but should not.
Do not use the Default VPC in a region because it is not flexible.

Same predicatible structure. Number of IP addresses is large because it uses the /16.
A subnet is smaller such as /20
The higher the / number is, the smaller the instance.

Two /17's will fit into a /16

This means sixteen /20 subnets can fit into one /16

Default VPC assigns public IPv4 addresses for any service that asks for it.

## Elastic Compute Cloud (EC2)

Default compute service. Provides access to virtual machines called instances.

IAAS - Insfrastructre as as Service

The unit of consumpltion is an instance

Private service by default. EC2 instance is configured to launch into a single VPC subnet. The public access must be configured.

The VPC needs to support public access. If you use a custom VPC then you must handle the networking on your own.

EC2 deploys into one AZ. If it fails, the instance fails.

There are different sizes and capatabilities.

On-Demand Billing - Per second. Only pay for what you consume.

Charge for running the instance, CPU and Memory. Charge for the storage. Extras for any commercial software the instance deploys with.

Local on-host storage or Elastic Block Storage

### Instance Lifecycle

Running - After finished provisioning
Stopped - Switching off when you don't need it
Terminated - Instance fully deleted.

Pricing based on

- CPU - processing capability
- Memory - fast area
- Storage - more medium term data is stored
- Networking - how it communicates with other services.

### Running State

Charged for all four categories.

Running on a physical host using CPU.
Using memory even with no processing.
OS is stored on disk allocated to you even if it is not being used currently.
Networking is always ready to transfer information.

### Stopped State

Charged for EBS storage

No CPU resources are being consumed
No memory is being used
Networking is not running
Storage is still allocated to the instance if it is in a running or stopped state.

### Terminated State

Deletes the disk and prevents all future charges.

### AMI (Server Image)

AMI can use used to create an EC2 instance
AMI can be created from an EC2 instance

Contains

- Permissions: control which accounts can and can't use the AMI.

  - Public - anyone can launch it. This is what the Windows and Linux images
  are stored as when an EC2 instance is booted up

  - Owner - implicit allowed to spin up new instances

  - Explicit - owner grants access to AMI for specifc AWS accounts

- Root Volume: can contain the boot volume

- Block Device Mapping: Configuration links the volumes that the AMI has and
how they're presented to the operating system. Determines which volume is a
boot volume and which volumes is a data volume.

The OS expects to see volumes presented to it as well as a device ID.
This links the volume to the device ID. It's a mapping system

### Connecting to EC2

Can use a version of linux or a version of windows

Connect to Windows using RDP (Remote Desktop Protocol), Port 3389

Linux SSH protocol, Port 22

Login to the instance using an SSH keypair.
This can be created or use an old one.

Private Key - Once and only once. Keep this safe.

Public Key - AWS keeps. When a new instance is started, the public key is placed on the instance.

The private is how you authenticate to the instance. If you have the private part, you can connect to an instance with the private part on it.

With a Linux instance you're using the private and public key to authenticate and connect to the instance.

With a Windows instance you provide the private key to gain access to the local admin password of the instance.

You connect to the instance using the RDP protocol and the admin password.

## S3 (Default Storage Service)

Global Storage plaform.

`Runs from all regions and is a public service`

Regional Based. If one region goes out, the service goes out.

Public Service. Can be accessed anywhere from the internet and with an unlimited amount of users connected.

### Objects

The data that S3 stores. Large scale datasets.

Can be thought of a file.

Two main components

- Object Key: File name in a bucket
- Value: Data or contents of the object
  - Zero bytes to 5 TB

Other components:

- Version ID
- Metadata
- Access Control
- Subresources

### Buckets

Created in a specific AWS Region.

- Data has a primary home region. Will not leave this region unless the architech desires.
- Blast Radius = Region

`Name is globally unique`

Unlimited number of Objects

All objects are stored within the Bucket at the same level.

If the objects name starts with a slash such as `/old/Koala1.jpg` the UI will present this as a folder. In actuality this is not true.

### S3 Patterns and Anti-Patterns

S3 is an object storage, not file, or block storage.

You can't mount an S3 Bucket

Great for large scale data storage, distribution, or upload

Great for 'offload'

INPUT and/or OUTPUT to MANY AWS products.

This should be the default storage plaform

## CloudFormation Basics

Templates can modify infrastucture to:

- create
- update
- delete

Written in YAML or JSON

```YAML
# This is not mandatory unless a description is added
AWSTemplateFormatVersion: "version date"

# Give details as to what this template does.
# If you use this section, it MUST immeditely follow the AWSTemplateFormatVersion.
Description:
  A sample template

# Can control the command line UI. The bigger your template, the more likely
# this section is needed
Metadata:
  template metadata

# Promt the user for more data. Name of something, size of instance,
# data validation
Parameters:
  set of parameters

# Another optional section. Allows lookup taples, not used often
Mappings:
  set of mappings

# Decision making in the template. Things will only occur if a condition is met.
# Step 1: create condition
# Step 2: use the condition to do something else in the template
Conditions:
  set of conditions

Transform:
  set of transforms

# The only mandatory field of this section
Resources:
  set of resources

# Once the template is finished it can return data or information.
# Could return the admin or setup address of a word press blog.
Outputs:
  set of outputs
```

### Resources

An example which creates an EC2 instance

```YAML
Resources:
  Instance: # Logical Resource
    Type: 'AWS::EC2::Instance' # This is what will be created
    Properties: # Configure the resources in a particular way
      ImageId: !Ref LatestAmiId
      Instance Type: !Ref Instance Type
      KeyName: !Ref Keyname
```

Once a template is created, AWS will make a stack. This is a living and active
representation of a template. One template can create infinite amount of stacks.

For any **Logical Resources** in the stack,
CF will make a cooresponding **Physical Resources** in your AWS account.

It is cloud formations job to keep the logical and physical resources in sync.

A template can be updated and then used to update the same stack

## CloudWatch Basics

Collects and manages operational data on your behalf

Three products in one

- Metrics: data relating to AWS products, apps, on-prem solutions
- Logs: collection, monitoring
- Events: event hub
  - If an AWS service does something, CW events can perform another action
  - Generate an event to do something at a certain time of day or time of week

### Namespace

Container for monitoring data

Naming can be anything so long as it's not `AWS/service`

- `AWS/EC2` is an example
- This is used for all metric data of that service

### Metric

Time ordered set of data points such as:

- CPU Usage
- Network IN/OUT
- Disk IO

This is not for a specific server. This could get things from different servers

Anytime CPU Utilization is reported, the **datapoint** will report

- Timestamp = 2019-12-03
- Value = 98.3

**Dimensions** seperate datapoints for different **things** or
**perspectives** within the same metric

### Alarms

Has two states `ok` or `alarm`

`Alarm` state can send an SNS or action

Third state can be insufficent data state. Not a problem.

## Shared Responsibility Model

AWS provide clarity around which areas of systems security are theirs,
and which are owned by the customer.

AWS: Responsible for security **OF** the cloud

Customer: Responsible for security **IN** the cloud

## High Availability (HA), Fault-Tolerance (FT) and Disaster Recover (DR)

### High Availability (HA)

- aims to **ensure** an agreed level of operational **performance**, usually
**uptime**, for a **higher than normal period**
- allows for easily replacable components
- maximizing a system's online time

#### Uptime Examples

99.9% (Three 9's) = 8.7 hours downtime per year
99.999 (Five 9's) = 5.26 minutes downtime per year

Instead of diagnosing the issue, it is important to swap out hardware

For high availability, user distruption is not ideal, but is allowed.

- The user might need to log back in or lose some data on their screen.

High availability needs redundant hardawre to minimize downtown.

### Fault-Tolerance (FT)

is the property that enables a system to **continue operating properly**
in the event of the **failure of some** (one or more faults within) of its
**components**

Example:
A patient is waiting for a life saving surgery and is under anesthetic.
While being monitored, the life support system is dosing medicine.
This type of system cannot only be highly available, even a momement of
interuption is deadly.

Fault tolerance is much more complicated than high availability and more
expensive. Outages must be minimized and the system needs levels of
redudancy.

An airplane is an example of system that needs Fault Tolerance. It has
more engines than it needs for redundancy.

### Disaster Recover (DR)

a set of policies, tools and procedures to **enable the recovery** or
**continuation** of **vital** technology infrastructure and systems
**following a natural or human-induced disaster**

This involved:

- Pre-planning
  - Ensure plans are in place for extra hardware
  - Do not store backups at the same site as the system
- DR Processes
  - Cloud machines ready when needed

This is designed to keep the crucuial and non replacable parts of the
system in place.

DR can largely be automated to eliminate the time for recovery as well as errors
