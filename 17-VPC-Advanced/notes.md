## VPC Advanced

### VPC Flow Logs

Capture packet metadata, not packet contents. Things like source IP,
destination IP, and packet size. Anything which could be observed
from the outside of the packet.

Capture data at various different monitoring points.

- VPC : all interfaces in that vpc
- Subnets : interfaces in that subnet
- Interface directly

VPC flow logs are not realtime.

Desination can be S3 or CloudWatch logs.

Childs of interfaces inherit the flow low monitoring from higher groups.

The packet will always have source followed by destination.

### Egress-Only Internet Gateway

IPv4 addresses are private or public

NAT allows private IPs to access public networks. It will not allow externally
initiated connections.

Using IPv6, all IPs are public.

Internet Gateway (IPv6) allows all IPs **in** and **out**

Egress-only is **outbound only** for IPv6. It is exactly the same as
NAT, only outbound only.

To configure the Egress-only gateway, you must add default IPv6 route ::/0
added to RT with eigw-id as target.

### VPC Endpoints (Gateway)

Provide private access to S3 and DynamoDB.

Normally when you want to access a public service through a VPC, you
need infrastructure to make this happen.

When you allocate a gateway endpoint to a subnet, a prefix list is added
to the route table.

The target is the gateway endpoint.

Any traffic destined for S3, goes via the gateway endpoint. The gateway
endpoint is highly available for all AZs in a region by default.

With a gateway endpoint you set which subnet will be used with it and
it will configure automatically.

A gateway endpoint is a VPC endpoint object.

Endpoint policy is used to control what things can be accessed by the endpoint.

Gateway endpoints can only be used to access services in the same region.
Can't access cross-region services.

S3 buckets can be set to private only by allowing access ONLY from
a gateway endpoint. For anything else, the implicit deny will apply.

They are only accessible from inside that specific VPC.

### VPC Endpoints (Interface)

Provide private access to AWS Public Services
Anything EXCEPT S3 and DynamoDB

These are not HA by default and are added to specific subnets.

Must add one endpoint for one subnet per AZ

Network access controlled via security groups.

You can use Endpoint policies to restrict what can be accessed with
the endpoint.

ONLY TCP and IPv4 at the moment.

Behind the scenes, it uses PrivateLink.

Endpoint provides a **NEW** service endpoint DNS

e.g. vpce-123-xyz.sns.us-east-1.vpce.amazonaws.com

- Endpoint : Regional DNS
- Endpoint : Zonal DNS

Either of those two points of endpoints can be used

PrivateDNS overrides the default DNS for services.

### VPC Peering

Direct encrypted network link between two VPCs

Works in the same or cross region and in the same or across accounts.

VPC peers have the option to allow Public Hostnames to resolve to
private IPs.

Same region SG's can reference peer security groups. This allows for the
same nesting of security groups within that region.

In different regions, you need to reference IP peers.

VPC peering connects **ONLY TWO**

VPC Peering does not support **transitive peering**

If you want to connect 3 VPCs, you need 3 connections. You can't route
through interconnected VPCs.

You are creating a logical gateway object in one VPC.

VPC Peering Connections CANNOT be created with overlapping VPC CIDRs
