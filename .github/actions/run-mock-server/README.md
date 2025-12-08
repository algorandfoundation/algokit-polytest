# Run Mock Server Action

A GitHub Actions composite action to start a mock server for testing Algorand API clients (algod, indexer, kmd).

## Description

This action sets up and starts a Bun-based mock server that simulates Algorand node APIs. It handles:

- Installing Bun runtime
- Installing mock-server dependencies
- Starting the server in the background
- Waiting for the server to be healthy
- Exporting environment variables for use in subsequent steps

## Inputs

| Input    | Required | Default | Description                                                        |
| -------- | -------- | ------- | ------------------------------------------------------------------ |
| `client` | Yes      | -       | The client type to mock: `algod`, `indexer`, or `kmd`              |
| `port`   | No       | \*      | Port to run the server on                                          |
| `ref`    | No       | `main`  | Git ref to use when the action is called from external repos       |

\* Default ports by client type:

- `algod`: 8000
- `kmd`: 8001
- `indexer`: 8002

## Outputs

This action exports the following environment variables:

| Client    | Environment Variable  | Example Value           |
| --------- | --------------------- | ----------------------- |
| `algod`   | `MOCK_ALGOD_URL`      | `http://localhost:8000` |
| `indexer` | `MOCK_INDEXER_URL`    | `http://localhost:8002` |
| `kmd`     | `MOCK_KMD_URL`        | `http://localhost:8001` |

## Usage

### Basic Usage (within the same repo)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start algod mock server
        uses: ./.github/actions/run-mock-server
        with:
          client: algod

      - name: Run tests
        run: |
          echo "Mock server URL: $MOCK_ALGOD_URL"
          # Your test commands here
```

### Multiple Mock Servers

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start algod mock server
        uses: ./.github/actions/run-mock-server
        with:
          client: algod

      - name: Start indexer mock server
        uses: ./.github/actions/run-mock-server
        with:
          client: indexer

      - name: Start kmd mock server
        uses: ./.github/actions/run-mock-server
        with:
          client: kmd

      - name: Run tests
        run: |
          echo "Algod URL: $MOCK_ALGOD_URL"
          echo "Indexer URL: $MOCK_INDEXER_URL"
          echo "KMD URL: $MOCK_KMD_URL"
```

### Custom Port

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start algod mock server on custom port
        uses: ./.github/actions/run-mock-server
        with:
          client: algod
          port: 9000

      - name: Run tests
        run: |
          # MOCK_ALGOD_URL will be http://localhost:9000
          curl $MOCK_ALGOD_URL/health
```

### Usage from External Repository

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout algokit-polytest
        uses: actions/checkout@v4
        with:
          repository: algorandfoundation/algokit-polytest
          ref: main
          path: algokit-polytest

      - name: Start mock server
        uses: ./algokit-polytest/.github/actions/run-mock-server
        with:
          client: algod
          ref: main
```

## Requirements

- The mock-server must be located at `resources/mock-server/` relative to this action's parent repository
- The runner must support Bun installation (Linux and macOS runners are supported)

## Troubleshooting

### Server fails to start

Check the server logs which are written to `/tmp/mock-server-{client}.log`. The action will automatically display these logs if the health check fails.

### Port conflicts

If the default port is already in use, specify a custom port:

```yaml
- uses: ./.github/actions/run-mock-server
  with:
    client: algod
    port: 9999
```

### Health check timeout

The action waits up to 30 seconds for the server to become healthy. If you need more time, consider checking your mock-server configuration or increasing server resources.
