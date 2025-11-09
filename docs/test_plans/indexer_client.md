# Polytest Test Plan
## Test Suites

### Get /health

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/accounts

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/accounts/{account Id}

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/accounts/{account Id}/apps Local State

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/accounts/{account Id}/assets

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/accounts/{account Id}/created Applications

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/accounts/{account Id}/created Assets

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/accounts/{account Id}/transactions

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/applications

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/applications/{application Id}

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/applications/{application Id}/box

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/applications/{application Id}/boxes

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/applications/{application Id}/logs

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/assets

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/assets/{asset Id}

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/assets/{asset Id}/balances

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/assets/{asset Id}/transactions

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/block Headers

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/blocks/{round Number}

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/transactions

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

### Get /v 2/transactions/{txid}

| Name | Description |
| --- | --- |
| [Common Tests](#common-tests) | Common tests for all endpoints |

## Test Groups

### Common Tests

| Name | Description |
| --- | --- |
| [Basic request and response validation](#basic-request-and-response-validation) | Given a known request validate that the same request can be made using our models. Then, validate that our response model aligns with the known response |

## Test Cases

### Basic request and response validation

Given a known request validate that the same request can be made using our models. Then, validate that our response model aligns with the known response
