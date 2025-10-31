# AlgoKit Polytest

This repos contains the polytest version control and configuration files for testing AlgoKit libraries.

## Usage

1. Add this repository as a submodule to your AlgoKit library repository:

```bash
git submodule add https://github.com/algorandfoundation/algokit-polytest.git
```

2. Initialize and update the submodule:

```bash
git submodule update --init --recursive
```

### Adding Tests

1. Create a new branch in the `algokit-polytest` submodule for your test(s). The branch should be named `<language>/<library>/<feature_name>`. For example, `python/algokit_transact/access_list`
1. Update the corresponding config file under `test_configs/` to add all the tests
1. Commit and push changes to the `algokit-polytest` branch
1. Create a PR against `algokit-polytest` main branch. This `algokit-polytest` PR *MUST* be merged before the feature PR in the library repo is merged.
1. Create a PR in your library repo with the `algokit-polytest` submodule pointing to `main`

## Potential Automation

To reduce manual steps needed, we can add the following workflows to each library repo:

1. **Polytest PR**: When a PR is created in the library repo with a new `algokit-polytest` submodule branch: Create a PR in `algokit-polytest` with the new branch link it in a comment on the library feature PR.
1. **Polytest Submodule Merge**: When the PR is merged in `algokit-polytest`: Update the `algokit-polytest` submodule in the feature branch of the library repo to point to `main`. Create a PR into the library feature branch and link it in a comment on the library feature PR.

These could be actions defined in a reusable GitHub Actions workflow in this repo that library repos can call.
