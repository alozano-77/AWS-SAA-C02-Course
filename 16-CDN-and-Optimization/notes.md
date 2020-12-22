## CloudFront

### Architecture Basics

Cloudfront is a global object cache (CDN)

Content is cached in locations close to customers.
If the content is not available on the local cache when requested, ClouldFront
will pull and cache it then.

This provides lower latency and higher throughput for customers.

Can handle static and dynamic content.

**Origin**  the source location of your content
**Distribution** the configuration unit of CloudFront
Edge locations - local infrastructure which hosts a cache of your data.
There are over 200 edge locations. They can be one or more racks in a
third party server system.

Regional Edge Cache - larger version of an edge location. Provides
another layer of caching.

#### Caching Optimisation

Parameters can be passed on the url such as query string parameter.
An example is `?language=en` and `?language=es`

To get the cached copy, you need to use the same query strings. If you do
use them, ensure the strings

### AWS Certificate Manager (ACM)

- HTTP lacks encryption and is insecure
- HTTPS uses SSL/TLS layer of encryption added to HTTP
- Data is encrypted in-transit
- Certificates allow servers to prove their identity
- Signed by a trusted authority (CA).
- To be secure, a website generates a certificate and has a CA sign it. The
website then uses that certificate to prove its authenticity.

Create, renew, and deploy certificates with ACM.

Supported AWS services ONLY (CloudFront and ALB, NOT EC2)

If it's not a managed service, ACM doesn't support it.

Cloudfront must have a trusted and signed certificate. It can't be self signed.

### Origin Access Identity (OAI)

This identity can be associated with a cloud front distribution.

The edge locations gain this identity.

We then remove the explicit allows and only allow the OAI to use it.

Best practice is to create one per distribution to manage permissions.

### AWS Global Accelerator

Starts with 2 **anycast** IP address
1.2.3.4 & 4.3.2.1

Anycast IP's allow a single IP to be in multiple locations.
Routing moves traffic to closest location.

Traffuc initially uses public internet and enters a global
accelerator edge location.

#### Key concepts

Move the AWS network closer to customers.

Global Accelerator moves the AWS network as close as possible.

Connections enter at edge, using anycast IPs. Transit over AWS backbone to 1+
locations.

Global accelerator is a network product. Can use TCP, UDP.

Caching is mostly cloudfront. TCP and UDP is mostly global accelerator
