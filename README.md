# AlgoKit Polytest

This repos contains the polytest version control and configuration files for testing AlgoKit libraries.

## Usage

Documentation on the recommended workflow can be found in the polytest repo [here](https://github.com/joe-p/polytest/blob/main/docs/multi_repo.md)

An example of integration with algokit-core can be seen in this draft PR: https://github.com/algorandfoundation/algokit-core/pull/285

In summary, the implementation repos must use `polytest` with the `--git` flag:

```toml
[tool.poe.tasks]
polytest = "polytest --config test_configs/transact.json --git https://github.com/joe-p/algokit-polytest#main run -t pytest"
```
