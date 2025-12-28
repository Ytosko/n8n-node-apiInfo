# n8n-nodes-apiinfo

This is an n8n community node. It lets you interact with ApiInfo in your n8n workflows.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

No credentials are required for this node.

## Compatibility

- n8n v0.124.0 or later

## Operations

- **Info**: Get information from the API.

## Resources

- [n8n Community Nodes](https://n8n.io/integrations/community-nodes/)

## API Documentation

### GET /{ip_address}
**Get details for IP**
Retrieve details for a specific IPv4 or IPv6 address.

### GET /{ip_address}/org
**Filter response by org field**
Get the organization field as plaintext for a specific IP address.

### GET /{ip_address}/city
**Filter response by city field**
Get the city as plaintext for a specific IP address.

### GET /{ip_address}/country
**Filter response by country field**
Get country ISO code as plaintext for a specific IP address.
