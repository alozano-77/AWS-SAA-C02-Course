## Virtual Private Cloud (VPC)

### Networking Refresher

#### IPv4 - RFC 791 (1981)

Represented different ways for people vs computer.

4 numbers from 0 to 255 seperated by a period

There is just over 4 billion addresses.

This was not very flexible because it was either too small or large for
some corporations. Some IP addresses was always left unused.

##### Class A range

Started at 0.0.0.0 and ended at 127.255.255.255.
Split into 128 class A networks
Handed out to large companies

##### Class B Range

Half the range of class A.
Started at 128.0.0.0 and ends at 191.255.255.255.

##### Class C range

Half of range class B
Started at 192.0.0.0 and ends at 223.255.255.255.

##### Class D and E

Outside of the scope of this class.

#### Internet / Private IPs

Defined by a standard RFC1918.

These can't communicate over the internet and are used internally only

One class A network: 10.0.0.0 - 10.255.255.255
16 Class B networks: 172.16.0.0 - 172.31.255.255
256 Class C networks: 192.168.0.0 - 192.168.255.255

#### Classless inter-domain routing (CIDR)

Not limited by the traditional methods.

**10.0.0.0/16** - 10.0.0.0 is the first address on the network and /16 is the size
of the network called the prefix. The bigger the prefix, the smaller the network
and the smaller the prefix, the bigger the network.

/16 provides 65,536 addresses. If you want to split this network, its easy

Just provide the following
10.0.0.0/17 and 10.0.128.0/17

You can split this again into a /18 if you like.
Just be careful to note the starting range properly.

This is called **subnetting**

#### IP address notations to remember

- **0.0.0.0/0** means all IP addresses
- **10.0.0.0/8** means 10.ANYTHING - Class A
- **10.0.0.0/16** means 10.0.ANYTHING - Class B
- **10.0.0.0/24** means 10.0.0.ANYTHING - Class C
- **10.0.0.0/32** means only 1 IP address

10.0.0.0/16 is the equivalent of 1,2,3,4 as a password. You should consider
other ranges that people might use to ensure it does not overlap.

#### Packets

Packet has a source IP address and a destination IP address. It also has
some data that the source IP wants to communicate with the destination IP.

TCP and UDP are protocols built on top of IP.

TCPIP means TCP running with IP
UDPIP means UDP running with IP

TCP/UDP Segment has a source and destination port number.

This allows devices to have multiple conversations at the same time.

In AWS when data goes through network devices, filters can be set based on
IP addresses and port numbers.

#### IPv6 - RFC 8200 (2017)

2001:0db8:28ac:0000:0000:82ae:3910:7334

In this case the value is hex and there are two octets per spacing or one hextet

The redudant zeros can be removed to create:

2001:0db8:28ac:0:0:82ae:3910:7334

or you can remove them entirely once per address like so

2001:0db8:28ac::82ae:3910:7334

##### Format

Each address is 128 bits long. They are addressed by the start of the network
and the prefix.

Since each grouping is 16 values, we can multiple the groups by this to achieve
the prefix.

2001:0db8:28ac::/48 really means the network starts at

2001:0db8:28ac:0000:0000:0000:0000:0000 and finishes at
2001:0db8:28ac:ffff:ffff:ffff:ffff:ffff

::/0 represents all IPv6 addresses

### VPC Sizing and Structure

Things to keep in mind

- What size should the VPC be. This will limit the use
- Are there any networks we can't use?
- Be mindful of ranges other VPC's use or are used in other cloud environments
- Try to predict the future uses
- VPC structure with tiers and resilience (availability) zones

VPC min /28 network (16 IP)
VPC max /16 (65456 IP)

Personal preference for 10.x.y.z range

Avoid common range 10.0 or 10.1, include up to 10.10

Suggest starting of 10.16

Reserve 2+ network ranges per region being used per account.
Think of the highest region you will operate in and add extra as a buffer.

An example:

- 3 regions in US, Europe, Aus (5) x 2 - assume 4 AWS accounts
- Total of 40 ranges

VPC services run from within subnets, not directly from the VPC

#### How to size VPC

Subnet is located in one availability zone. How many AZ's will your VPC use?
Some regions have more AZ's, but they all have at least 3. It is a good practice
to start splitting the network into at least 4 AZ's.

This would be split into tiers (web, application, db, spare)

Taking a /16 subnet and splititng it 16 ways will make a /20

### Custom VPC

- Regional Service - All AZs in that region
- Allows isolated networks inside AWS
- Nothing IN or OUT without explicit configuration
- Flexible configuration - simple or multi-tier
- Allow connection to other cloud or on-prem networking
- Default or Dedicated Tenancy
  - Default allows on a per resource decision later on
  - Dedicated locks any resourced created in that VPC to be on dedicated
  hardware which comes at a cost premium.
  - Should pick default most of the time

#### VPC Facts

- Can use IPv4 Private CIDR block and public IPs
- Allocated 1 mandatory primary private IPv4 CIDR blocks
  - Min /28 prefix (16 IP)
  - Max /16 prefix (65,536 IP)
- Can add secondary IPv4 Blocks
  - Max of 5, can be increased with a support ticket
  - When thinking of VPC, it has a pool of private IPv4 addresses and can
  use public addresses when needed.
- Another option is a single assigned IPv6 /56 CIDR block
  - Still being matured, not everything works the same.
  - With increasing use of IPv6, this should be thought of as default
  - Range is either allocated by AWS, or private addresses can be used
  that are already owned.
  - Don't have a different of private vs public, they are all routed as
  public by default.

#### DNS

Provided by Route 53

Available on the base IP address of the VPC + 2

If the VPC is 10.0.0.0 then the DNS IP will be 10.0.0.2

Two important settings which can cause issues.
These are found in the actions area of a VPC

- enableDnsHostnames: **Edit DNS hostnames**
  - Indicates whether instances with public IP addresses
in a VPC are given public DNS hostnames. If this is set to true, instances
will get get public DNS hostnames.
- enableDnsSupport: **Edit DNS resolution**
  - indidcates if DNS resolution is enabled or disabled in the VPC
  - If True: instances in the VPC can use the dns ip address. **VPC + 2**
  - If False this is not available

### VPC Subnets

This is what services run from inside VCPs.

AZ Resilient subnetwork of a VPC. This runs within a particular AZ.

Runs inside of an AZ. If the AZ fails, the subnet and services also fail.

We put different components of our infrastructure into different AZs.

1 subnet can only have 1 AZ
1 AZ can have zero or many subnets

IPv4 CIDR is a subset of the VPC CIDR block.

Cannot overlap with any other subnets in that VPC

Subnet can optionally be allocated IPv6 CIDR block
(256 /64 subnets can fit in the /56 VPC)

Subnets can communicate with other subnets in the VPC by default.

#### Reserved IP addresses

There are five IP addresses within every VPC subnet that you cannot use.
Whatever size of the subnet, the IP addresses are five less than you expect.

10.16.16.0/20 (10.16.16.0 - 10.16.31.255)

- Network address: 10.16.16.0
- Network + 1: 10.16.16.1 - VPC Router
- Network + 2: 10.16.16.2 - Reserved for DNS
- Network + 3: 10.16.16.3 - Reserved for future AWS use
- Broadcast Address: 10.16.31.255 (Last IP in subnet)

Keep this in mind when making smaller VPCs and subnets.

VPC has a configuration object applied to it called DHCP Option Set.
This is how computing devices recieve IP addresses automatically. There is
one option set applied to a VPC at one time and this flows through
to subnets.

- This can be changed, can create new ones, but you cannot edit one.
- If you want to change the settings
  - You can create a new one
  - Change the VPC allocation to the new one
  - Delete the old one

Can also define

- Auto Assign IPv4 address
  - This will create a public IP address in addition to their private subnet
- Auto Assign IPv6 address
  - For this to work, the subnet and VPC need an allocation.

These are defined at the subnet level and flow down.

### VPC Routing and Internet Gateway

VPC Router

Highly available device available in every VPC which moves traffic from
somewhere to somewhere else.

Router has a network interface in every subnet in the VPC. **network + 1**
Routes traffic between subnets.

Controlled by 'route tables' defines what the VPC router will do with traffic
when data leaves that subnet.

A VPC is created with a main route table. If you don't associate a custom
route table with a subnet, it uses the main route table of the VPC.

If you do associate a custom route table you create with a subnet, then the
main route table is disassociated. A subnet can only have one route table
associated at a time, but one route table can be associated by many subnets.

#### Route Tables

The higher the prefix, the more specific the route, thus higher priority

When target says **local** that means the VPC can route to the VPC itself.

Local routes always take priorty and can never be updated.

#### Internet Gateway

Regional resilient gateway attached to a VPC.

DO NOT NEED one per AZ. One IGW will cover all AZ's in a region

1 VPC can have no IGW or it can have 1 IGW

A IGW can be created and attached to no VPC, but it can only be attached
to one VPC at a time.

Runs from within the AWS public zone

It is what allows gateway traffic between the VPC and the internet or AWS
Public Zones (S3, SQS, SNS, etc.)

It is a managed gateway to AWS handles the performance.

#### Using IGW

In this example, an EC2 instance has:

- Private IP address of 10.16.16.20
- Public address of 43.250.192.20

The public address is not public and connected to the EC2 instance itself.
Instead, the IGW creates a record that links the instance's private IP
to the public IP. This is why when an EC2 instance is created it only
sees the private IP address. This is IMPORTANT. For IPv4 it is not configured
in the OS with the public address.

When the linux instance wants to communicate with the linux update service,
it makes a packet of data.

The packet has a source address of the EC2 instance and a destination address
of the linux update server. At this point the packet is not configured with
any public addressing and could not reach the linux update server.

The packet arrives at the internet gateway.

The IGW sees this is from the EC2 instance and analyzes the source IP address.
It changes the packet source IP address from the linux EC2 server and puts
on the public IP address that is routed from that instance. The IGW then
pushes that packet on the public internet.

On the return, the inverse happens. As far as it is concerned it does not know
about the private address and instead uses the instance's public IP address.

If the instance uses an IPv6 address, that public address is good to go. The IGW
does not translate the packet and only pushes it to a gateway.

#### Bastion Host / Jumpbox

It is an instance in a public subnet in a VPC.

These are used to allow incoming management connections.

Once connected, you can then go on to access internal only VPC resources.

Used as a management point or as an entry point at a private VPC.

This is an inbound management point. Can be configured to only allow
specific IP addresses or to authenticate with SSH. It can also integrate
with your on premise identification service.

### Network Access Control List (NACL)

Network Access Control Lists (NACLs) are a type of security filter
(like firewalls) which can filter traffic as it enters or leaves a subnet.

All VPCs have a default NACL, this is associated with all subnets of that VPC
by default.

NACLs are used when traffic enters or leaves a subnet.
Since they are attached to a subnet and not a resource, they only filter
data as it crosses in

If two EC2 instances in a VPC communicate, the NACL does nothing because
it is not involved.

NACLs have two sets of rules

- inbound rule set
- outbound rule setset

You are trying to ssh into the bastion host

- the traffic leaves the machine
- crosses the internet
- uses **inbound** rules

When a specific rule set has been called, the one with the lowest
rule ## first.

As soon as one rule, inbound or outbound, then the processing stops for
that particular piece of traffic.

The action can be for the traffic to **cross** or **deny** the traffic.

Each rule has the following fields related to traffic

- type
- protocol: tcp, udp, or icmp
- port range

Examples:

- ssh: tcp port 22
- http: tcp port 80
- https: tcp port 443
- ping traffic: icmp

Inbound rule: Source - who traffic is from
Outbound rule: Destination - who traffic is destined to

If all of those fields match, then the first rule will either allow or deny.

The rule at the bottom with * is the **implicit deny**
This cannot be edited and is defaulted on each rule list.
If no other rules match the traffic being evaluated, it will be denied.

There is also rule 100, which is a catch all allow. This can be edited.

#### NACLs example below

- Bob wants to view a blog using https(tcp/443)
- We need a NACL rule to allow TCP on port 443.
- All IP communication has two parts
  - Initiation
  - Response
- Bob is initiating a connection to the server to ask for a webpage
  - This is the initiation
- Server will respond with an **Ephemeral** port
- Bob talks to the webserver connecting to a port on that server (tcp/443)
  - This is a well known port number
- Bob's pc tells the server it can talk to back to Bob on a specific port
  - Wide range from port 1024, 65535
  - That response is outbound traffic
- When using NACLs, you must add an outbound port for the response traffic
as well as the inbounding port. This is the ephemeral port.
- If the webserver is not managing the apps server, it must communicate
back on a different port.
- The data is moving out of the web subnet and in on the app subnet
  - This complicates things

#### Exam powerup

NACLs are stateless and so see initiation and reponse phases of a connection
and 1 inbound and 1 outbound stream requiring two roles (one IN one OUT)

NACLs are attached to subnets and only filter data as it crosses the
subnet boundary. Two EC2 instances in the same subnet will not check against
the NACLs when moving data.

Can explicitly allow and deny traffic. If you need to block one particular
thing, you need to use NACLs.

They only see IPs, ports, protocols, and other network connections.
No logical resources can be changed with them.

NACLs cannot be assigned to specific AWS resources.

Use with security groups to add explicit deny (Bad IPs/nets)

One subnet can only be assigned to one NACL at a time.

NACLs are processed in order starting at the lowest rule number until
it gets to the catch all. A rule with a lower rule number will be processed
before another rule with a higher rule number.

### Security Groups

An EC2 instance has one more more attached network interfaces.
The network interfaces and not the IP itself is given the private ip addresses.

When data is sent, it goes through this network interface. This is located
in one and only one AZ.

SGs are boundaries which can filter traffic. Instead of being attached
to a subnet, they are assigned to an AWS resource.

When Bob browses, it must pass through the security group to the network
interface of the EC2 interface, the webserver.

The security group is attached to a resource and not a security subnet.

Just like NACLs, security groups have two sets of rules.

NACLs are stateless. For a single communication between Bob and the server,
it has two seperate and stateless points of communication.

SGs are stateful. When Bob communicates with the server, the response with the
traffic is viewed as the same communication. This means only one rule is
required, one inbound rule. Any return traffic is automatically included
in the allow.

This makes them easier to deal with.

SG understand AWS logical resources so they're not limit to IP traffic only.
This means they can have a source and destination referencing the instance
and not the IP.

The SG can reference itself and will do so when creating the default.

SG's have a hidden implicit **Deny**. Anything that is not allowed in the rule
set for the SG is implicitly denied.

SG cannot explicit deny anything.

Wordpress Example: Allow access using port 443 from anywhere. What
if Bob is evil and wants to damage it. The security group will allow anything
from anywhere on that port.

NACLs are used in conjunction with SGs to do explicit denys.

#### Exam Powerups

SGs are stateful, they see traffic and response as the same rule.
Can filter based on AWS logical resources or other SGs
SGs have an implicit deny and can explcit allow
SG CANNOT EXPLICITLY DENY

NACLs are used when products cannot use SGs, NAT Gateways.
NACLs are used when adding explicit deny, bad IPs or bad actors
SG is the default almost everwhere because they are stateful
NACLs are associated with a subnet and only filter traffic that crosses
that boundary. If they are in the same subnet, it will not do anything

### Network Address Translation (NAT) gateway

Set of different processes that can address IP packets by changing
their source or destination addresses.

IP masquerading, hides CIDR block behind one IP. This is many private
IPs attached to one public IP.

This gives private CIDR range **outgoing** internet access.

Incoming connections don't work. Outgoing connections can get a response
wrapped together, but incoming cannot initiate.

#### Key facts

Must run from a public subnet to allow for public IP address

Uses Elastic IPs (Static IPv4 Public)

- Don't change
- Allocated to your account

AZ resilient service (HA in that AZ)

For a fully region resillient service, you must deploy
one NATGW in each AZ
RT in each AZ with NATGW as target

Managed service, scales up to 45 Gbps. Can deploy multiple NATGW to increase
bandwidth.

$ is charged on duration and data volume

NATGW is highly available in **one** AZ. If that AZ fails, there is
no recovery. You must deploy one in each AZ you use for region resillience.

#### Nat Instance vs NATGW

NATGW should be the default for most situations.
NATGW cannot do port forwarding or be a bastion server.
