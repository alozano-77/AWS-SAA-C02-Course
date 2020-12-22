## HA and Scaling

### Load Balancing Fundamentals

Without load balancing, it is difficult to scale.

The user connects to a load balancer that is set to listens on port 80 and 443

Within AWS, the ports the load balancer will listen to is called
the **listener**.

The user is connected to the load balancer and not the actual server.

Behind the load balancer, there is an application server. At a high
level when Bob connects to the load balancer, it distributes that to
servers on the application server.

As long as 1+ servers are available, the LB is operational. Clients
shouldn't see errors.

#### LB Exam Powerup

Clients connect to the **listener** of the load balancer

The load balancer connects to one or more **targets** or servers

Listener connection - one connection between the client and listener
Backend connection - one connection between load balancer and backend instance

Client is abstracted away from individual servers

Used for high availability, fault tolerance, and scaling

### Application Load Balancer (ALB)

ALB is a layer 7 - it is capable of inspecting data that passes through
it and can understand the application layer

It can take action based on things from that protocol

These are scalable and highly available.

Internet facing or Internal

Internal load balancer is used for inside a VPC only

Listens on the outside and sends to target groups

#### Cross zone load balancing

Each node that is part of the load balancer is able to distribute load
even if its not in the same AZ. It is the reason we can achieve a balanced
distribution of connections behind a load balancer.

It can also provide health checks on the target servers.

If all instances are shown as healthy, it can distribute evenly.

ALB can support a wide array of targets. An individual target can be a
member of multiple groups.

#### ALB Exam Powerup

**Targets** are lambda functions or EC2 instances that are directed towards.

Rules are path based or host based.

Support EC2, EKS, Lambda, HTTPS, HTTP/2 and websockets

ALB can use SNI for multiple SSL certs - host based rules

AWS does not suggest using Classic Load Balancer (CLB), these are legacy.

### Launch Configuration and Templates

LC and LT key concepts. They are documents which allow you to config an EC2
instance in advance. You can configure userdata and IAM role along with
networking and security groups.

Launch templates provide T2/T3 Unlimited, placement groups with more.

If you need to adjust a configuration, you must make a new one and launch it.

Launch Templates can be used to save time when provisioning EC2 instances
from the console UI / CLI.

### Auto Scaling Groups

Automatic scaling and self-healing for EC2

They make use of Launch Templates to know what to provision.

They use one version or one configuration they're assigned with.

Minimum, Desired, and Maximum Size.

Provision or Terminate instances to keep at the desired level

Scaling Policies automate based on metrics.

Auto Scaling Groups will try to keep the AZs equal with the number of EC2
instances.

#### Scaling Policies

Manual Scaling - manually adjust the desired capacity

Scheduled Scaling - time based adjustments

Dynamic Scaling

- Simple : If CPU is above 50%, add one to capacity
- Stepped : If CPU usage is above 50%, add one, if above 80% add three
- Target : Desired aggregate CPU = 40%, ASG will achieve this

Cooldown Period

How long to wait at the end of a scaling action before scaling again.

AGS can use the load balancer health checks rather than EC2.

Autoscaling Groups are free
Always use cool downs to avoid rapid scaling.

Think about more, smaller instances to allow granularity

You should use ALB with autoscaling groups.

ASG defines when and where, Launch Template defines what.

### Network Load Balancer (NLB)

Part of AWS Version 2 series of load balances.

NLB's are Layer 4, only understand TCP and UDP.

Can't understand or interpret HTTP or HTTPs, for these reason they are much
faster in latency. You should default to NLB if http is not used.

There is nothing stopping NLB from load balancing on HTTP just by data.

Rapid scaling - **millions of requests per second**

Only member of the load balancing family that can be provided a static IP.
There is 1 interface per AZ. Can also use Elastic IPs (whitelisting)

Can do SSL pass through.

NLB can load balance non HTTP/S applications, doesn't care about anything
above TCP/UDP. This means it can handle load balancing for FTP or things
that aren't HTTP or HTTPS.

### SSL Offload and Session Stickiness

#### Bridging - Default mode

One or more clients makes one or more connections to a load balancer.
The load balancer is configured so the **listener** uses HTTPS, SSL connections
occur between the client and the load balancer.

The load balancer then needs an SSL certificate that matches the domain name
of the application.

If you need to be careful of where your certificates are stored, you may
have a problem with this system.

ELB initiates a new SSL connection to backend instances with a removed
HTTPS certificate. This can take actions based on the content of the HTTP.

It needs to decrypt any data that is being encrypted by the client.

The EC2 will need matching SSL certificates.

Needs the compute for the cryptographic operations. Every EC2 instance must
peform these cryptographic operations.

#### Pass-through

The client connects, but the load balancer passes the connection along without
decrypting the data at all. The instances still need the SSL certificates,
but the load balancer does not.

The load balancer is configured for TCP, it can see the source or destinations,
but it never touches the encrypted connection. The certificate never
needs to be seen by AWS.

Negative is you don't get any load balancing based on the HTTP part
because that is never exposed to the load balancer.

#### Offload

Clients connect to the load balancer using HTTPS and are terminated on the
load balancer. The LB needs an SSL certificate to decrypt the data, but
on the backend the data is sent via HTTP. While there is a certificate
required on the load balancer, this is not needed on the LB.

Data is in plaintext form across AWS's network. Not a problem for most.

#### Connection Stickiness

If there is no stickiness, each time the customer logs on they will have
a stateless experience. If the state is stored on a particular server,
sessions can't be load balanced across multiple servers.

Session Stickiness is an option. If enabled, the first time a user makes a
request, the load balancer generates a cookie called AWSALB. A valid duration
is between one second and seven days. For this time, sessions will be sent to
the same backend instance. This will happen until:

- If we have a server failure, then the user will be moved to a different
server.
- The cookie could expire, the whole process will repeat and will recieve a
new cookie and the process will start again.

This could cause backend unevenness
